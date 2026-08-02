import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { readMultipartCsv } from "@/utils/csv/process";

const encoder = new TextEncoder();
const MB = 1024 * 1024;

function multipartHeaders(boundary: string) {
  return { "content-type": `multipart/form-data; boundary=${boundary}` };
}

describe("readMultipartCsv", () => {
  it("streams a valid csv field and returns its text", async () => {
    const formData = new FormData();
    formData.set(
      "csv",
      new Blob(["header,value\none,two"], { type: "text/csv" }),
      "orders.csv",
    );
    const request = new NextRequest("http://localhost/api/upload", {
      method: "POST",
      body: formData,
    });

    await expect(readMultipartCsv(request)).resolves.toBe("header,value\none,two");
  });

  it("rejects an oversized declared multipart body before reading its stream", async () => {
    let pulls = 0;
    const stream = new ReadableStream<Uint8Array>(
      {
        pull(controller) {
          pulls += 1;
          controller.enqueue(encoder.encode("unexpected body read"));
        },
      },
      { highWaterMark: 0 },
    );
    const request = new NextRequest("http://localhost/api/upload", {
      method: "POST",
      headers: {
        ...multipartHeaders("declared-limit"),
        "content-length": String(11 * MB),
      },
      body: stream,
    });
    const pullsBeforeRead = pulls;

    await expect(readMultipartCsv(request)).rejects.toThrow("CSV");
    expect(pulls).toBe(pullsBeforeRead);
  });

  it("stops a chunked multipart body once it exceeds the upload limit", async () => {
    const boundary = "chunked-limit";
    let pulls = 0;
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) {
        pulls += 1;
        if (pulls === 1) {
          controller.enqueue(encoder.encode(
            `--${boundary}\r\nContent-Disposition: form-data; name=\"csv\"; filename=\"orders.csv\"\r\nContent-Type: text/csv\r\n\r\n`,
          ));
          return;
        }
        if (pulls <= 21) {
          controller.enqueue(new Uint8Array(MB));
          return;
        }
        controller.enqueue(encoder.encode(`\r\n--${boundary}--\r\n`));
        controller.close();
      },
    });
    const request = new NextRequest("http://localhost/api/upload", {
      method: "POST",
      headers: multipartHeaders(boundary),
      body: stream,
    });

    await expect(readMultipartCsv(request)).rejects.toThrow("CSV");
    expect(pulls).toBeLessThan(20);
  });

  it("rejects a multipart request without the csv field", async () => {
    const formData = new FormData();
    formData.set("not-csv", "value");
    const request = new NextRequest("http://localhost/api/upload", {
      method: "POST",
      body: formData,
    });

    await expect(readMultipartCsv(request)).rejects.toThrow("CSV");
  });
});
