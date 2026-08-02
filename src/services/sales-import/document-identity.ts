export function disambiguateLinxDocumentNumber(
  documentNumber: string,
  linxIdentifier: string,
) {
  return `${documentNumber}#linx:${linxIdentifier.toLowerCase()}`;
}
