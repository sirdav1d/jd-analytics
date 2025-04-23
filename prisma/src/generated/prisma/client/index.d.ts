
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Organization
 * 
 */
export type Organization = $Result.DefaultSelection<Prisma.$OrganizationPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Pedido
 * 
 */
export type Pedido = $Result.DefaultSelection<Prisma.$PedidoPayload>
/**
 * Model DashboardMarketing
 * 
 */
export type DashboardMarketing = $Result.DefaultSelection<Prisma.$DashboardMarketingPayload>
/**
 * Model Trafego
 * 
 */
export type Trafego = $Result.DefaultSelection<Prisma.$TrafegoPayload>
/**
 * Model CanalTrafego
 * 
 */
export type CanalTrafego = $Result.DefaultSelection<Prisma.$CanalTrafegoPayload>
/**
 * Model AnuncioCTR
 * 
 */
export type AnuncioCTR = $Result.DefaultSelection<Prisma.$AnuncioCTRPayload>
/**
 * Model AnuncioConversao
 * 
 */
export type AnuncioConversao = $Result.DefaultSelection<Prisma.$AnuncioConversaoPayload>
/**
 * Model PalavraChave
 * 
 */
export type PalavraChave = $Result.DefaultSelection<Prisma.$PalavraChavePayload>
/**
 * Model DashboardComercial
 * 
 */
export type DashboardComercial = $Result.DefaultSelection<Prisma.$DashboardComercialPayload>
/**
 * Model ReceitaCategoria
 * 
 */
export type ReceitaCategoria = $Result.DefaultSelection<Prisma.$ReceitaCategoriaPayload>
/**
 * Model ReceitaMetodoPagamento
 * 
 */
export type ReceitaMetodoPagamento = $Result.DefaultSelection<Prisma.$ReceitaMetodoPagamentoPayload>
/**
 * Model ClientesRecorrentesVsUnicos
 * 
 */
export type ClientesRecorrentesVsUnicos = $Result.DefaultSelection<Prisma.$ClientesRecorrentesVsUnicosPayload>
/**
 * Model ProdutoRank
 * 
 */
export type ProdutoRank = $Result.DefaultSelection<Prisma.$ProdutoRankPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER'
};

export type Role = (typeof Role)[keyof typeof Role]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Organizations
 * const organizations = await prisma.organization.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Organizations
   * const organizations = await prisma.organization.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.organization`: Exposes CRUD operations for the **Organization** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Organizations
    * const organizations = await prisma.organization.findMany()
    * ```
    */
  get organization(): Prisma.OrganizationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pedido`: Exposes CRUD operations for the **Pedido** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Pedidos
    * const pedidos = await prisma.pedido.findMany()
    * ```
    */
  get pedido(): Prisma.PedidoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.dashboardMarketing`: Exposes CRUD operations for the **DashboardMarketing** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DashboardMarketings
    * const dashboardMarketings = await prisma.dashboardMarketing.findMany()
    * ```
    */
  get dashboardMarketing(): Prisma.DashboardMarketingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.trafego`: Exposes CRUD operations for the **Trafego** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Trafegos
    * const trafegos = await prisma.trafego.findMany()
    * ```
    */
  get trafego(): Prisma.TrafegoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.canalTrafego`: Exposes CRUD operations for the **CanalTrafego** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CanalTrafegos
    * const canalTrafegos = await prisma.canalTrafego.findMany()
    * ```
    */
  get canalTrafego(): Prisma.CanalTrafegoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.anuncioCTR`: Exposes CRUD operations for the **AnuncioCTR** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AnuncioCTRS
    * const anuncioCTRS = await prisma.anuncioCTR.findMany()
    * ```
    */
  get anuncioCTR(): Prisma.AnuncioCTRDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.anuncioConversao`: Exposes CRUD operations for the **AnuncioConversao** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AnuncioConversaos
    * const anuncioConversaos = await prisma.anuncioConversao.findMany()
    * ```
    */
  get anuncioConversao(): Prisma.AnuncioConversaoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.palavraChave`: Exposes CRUD operations for the **PalavraChave** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PalavraChaves
    * const palavraChaves = await prisma.palavraChave.findMany()
    * ```
    */
  get palavraChave(): Prisma.PalavraChaveDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.dashboardComercial`: Exposes CRUD operations for the **DashboardComercial** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DashboardComercials
    * const dashboardComercials = await prisma.dashboardComercial.findMany()
    * ```
    */
  get dashboardComercial(): Prisma.DashboardComercialDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.receitaCategoria`: Exposes CRUD operations for the **ReceitaCategoria** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ReceitaCategorias
    * const receitaCategorias = await prisma.receitaCategoria.findMany()
    * ```
    */
  get receitaCategoria(): Prisma.ReceitaCategoriaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.receitaMetodoPagamento`: Exposes CRUD operations for the **ReceitaMetodoPagamento** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ReceitaMetodoPagamentos
    * const receitaMetodoPagamentos = await prisma.receitaMetodoPagamento.findMany()
    * ```
    */
  get receitaMetodoPagamento(): Prisma.ReceitaMetodoPagamentoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.clientesRecorrentesVsUnicos`: Exposes CRUD operations for the **ClientesRecorrentesVsUnicos** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ClientesRecorrentesVsUnicos
    * const clientesRecorrentesVsUnicos = await prisma.clientesRecorrentesVsUnicos.findMany()
    * ```
    */
  get clientesRecorrentesVsUnicos(): Prisma.ClientesRecorrentesVsUnicosDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.produtoRank`: Exposes CRUD operations for the **ProdutoRank** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProdutoRanks
    * const produtoRanks = await prisma.produtoRank.findMany()
    * ```
    */
  get produtoRank(): Prisma.ProdutoRankDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Organization: 'Organization',
    User: 'User',
    Pedido: 'Pedido',
    DashboardMarketing: 'DashboardMarketing',
    Trafego: 'Trafego',
    CanalTrafego: 'CanalTrafego',
    AnuncioCTR: 'AnuncioCTR',
    AnuncioConversao: 'AnuncioConversao',
    PalavraChave: 'PalavraChave',
    DashboardComercial: 'DashboardComercial',
    ReceitaCategoria: 'ReceitaCategoria',
    ReceitaMetodoPagamento: 'ReceitaMetodoPagamento',
    ClientesRecorrentesVsUnicos: 'ClientesRecorrentesVsUnicos',
    ProdutoRank: 'ProdutoRank'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "organization" | "user" | "pedido" | "dashboardMarketing" | "trafego" | "canalTrafego" | "anuncioCTR" | "anuncioConversao" | "palavraChave" | "dashboardComercial" | "receitaCategoria" | "receitaMetodoPagamento" | "clientesRecorrentesVsUnicos" | "produtoRank"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Organization: {
        payload: Prisma.$OrganizationPayload<ExtArgs>
        fields: Prisma.OrganizationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrganizationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrganizationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          findFirst: {
            args: Prisma.OrganizationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrganizationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          findMany: {
            args: Prisma.OrganizationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>[]
          }
          create: {
            args: Prisma.OrganizationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          createMany: {
            args: Prisma.OrganizationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrganizationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>[]
          }
          delete: {
            args: Prisma.OrganizationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          update: {
            args: Prisma.OrganizationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          deleteMany: {
            args: Prisma.OrganizationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrganizationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OrganizationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>[]
          }
          upsert: {
            args: Prisma.OrganizationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          aggregate: {
            args: Prisma.OrganizationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrganization>
          }
          groupBy: {
            args: Prisma.OrganizationGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrganizationGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrganizationCountArgs<ExtArgs>
            result: $Utils.Optional<OrganizationCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Pedido: {
        payload: Prisma.$PedidoPayload<ExtArgs>
        fields: Prisma.PedidoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PedidoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PedidoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PedidoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PedidoPayload>
          }
          findFirst: {
            args: Prisma.PedidoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PedidoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PedidoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PedidoPayload>
          }
          findMany: {
            args: Prisma.PedidoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PedidoPayload>[]
          }
          create: {
            args: Prisma.PedidoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PedidoPayload>
          }
          createMany: {
            args: Prisma.PedidoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PedidoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PedidoPayload>[]
          }
          delete: {
            args: Prisma.PedidoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PedidoPayload>
          }
          update: {
            args: Prisma.PedidoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PedidoPayload>
          }
          deleteMany: {
            args: Prisma.PedidoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PedidoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PedidoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PedidoPayload>[]
          }
          upsert: {
            args: Prisma.PedidoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PedidoPayload>
          }
          aggregate: {
            args: Prisma.PedidoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePedido>
          }
          groupBy: {
            args: Prisma.PedidoGroupByArgs<ExtArgs>
            result: $Utils.Optional<PedidoGroupByOutputType>[]
          }
          count: {
            args: Prisma.PedidoCountArgs<ExtArgs>
            result: $Utils.Optional<PedidoCountAggregateOutputType> | number
          }
        }
      }
      DashboardMarketing: {
        payload: Prisma.$DashboardMarketingPayload<ExtArgs>
        fields: Prisma.DashboardMarketingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DashboardMarketingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DashboardMarketingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DashboardMarketingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DashboardMarketingPayload>
          }
          findFirst: {
            args: Prisma.DashboardMarketingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DashboardMarketingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DashboardMarketingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DashboardMarketingPayload>
          }
          findMany: {
            args: Prisma.DashboardMarketingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DashboardMarketingPayload>[]
          }
          create: {
            args: Prisma.DashboardMarketingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DashboardMarketingPayload>
          }
          createMany: {
            args: Prisma.DashboardMarketingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DashboardMarketingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DashboardMarketingPayload>[]
          }
          delete: {
            args: Prisma.DashboardMarketingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DashboardMarketingPayload>
          }
          update: {
            args: Prisma.DashboardMarketingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DashboardMarketingPayload>
          }
          deleteMany: {
            args: Prisma.DashboardMarketingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DashboardMarketingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DashboardMarketingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DashboardMarketingPayload>[]
          }
          upsert: {
            args: Prisma.DashboardMarketingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DashboardMarketingPayload>
          }
          aggregate: {
            args: Prisma.DashboardMarketingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDashboardMarketing>
          }
          groupBy: {
            args: Prisma.DashboardMarketingGroupByArgs<ExtArgs>
            result: $Utils.Optional<DashboardMarketingGroupByOutputType>[]
          }
          count: {
            args: Prisma.DashboardMarketingCountArgs<ExtArgs>
            result: $Utils.Optional<DashboardMarketingCountAggregateOutputType> | number
          }
        }
      }
      Trafego: {
        payload: Prisma.$TrafegoPayload<ExtArgs>
        fields: Prisma.TrafegoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TrafegoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrafegoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TrafegoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrafegoPayload>
          }
          findFirst: {
            args: Prisma.TrafegoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrafegoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TrafegoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrafegoPayload>
          }
          findMany: {
            args: Prisma.TrafegoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrafegoPayload>[]
          }
          create: {
            args: Prisma.TrafegoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrafegoPayload>
          }
          createMany: {
            args: Prisma.TrafegoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TrafegoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrafegoPayload>[]
          }
          delete: {
            args: Prisma.TrafegoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrafegoPayload>
          }
          update: {
            args: Prisma.TrafegoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrafegoPayload>
          }
          deleteMany: {
            args: Prisma.TrafegoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TrafegoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TrafegoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrafegoPayload>[]
          }
          upsert: {
            args: Prisma.TrafegoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrafegoPayload>
          }
          aggregate: {
            args: Prisma.TrafegoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTrafego>
          }
          groupBy: {
            args: Prisma.TrafegoGroupByArgs<ExtArgs>
            result: $Utils.Optional<TrafegoGroupByOutputType>[]
          }
          count: {
            args: Prisma.TrafegoCountArgs<ExtArgs>
            result: $Utils.Optional<TrafegoCountAggregateOutputType> | number
          }
        }
      }
      CanalTrafego: {
        payload: Prisma.$CanalTrafegoPayload<ExtArgs>
        fields: Prisma.CanalTrafegoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CanalTrafegoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanalTrafegoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CanalTrafegoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanalTrafegoPayload>
          }
          findFirst: {
            args: Prisma.CanalTrafegoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanalTrafegoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CanalTrafegoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanalTrafegoPayload>
          }
          findMany: {
            args: Prisma.CanalTrafegoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanalTrafegoPayload>[]
          }
          create: {
            args: Prisma.CanalTrafegoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanalTrafegoPayload>
          }
          createMany: {
            args: Prisma.CanalTrafegoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CanalTrafegoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanalTrafegoPayload>[]
          }
          delete: {
            args: Prisma.CanalTrafegoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanalTrafegoPayload>
          }
          update: {
            args: Prisma.CanalTrafegoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanalTrafegoPayload>
          }
          deleteMany: {
            args: Prisma.CanalTrafegoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CanalTrafegoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CanalTrafegoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanalTrafegoPayload>[]
          }
          upsert: {
            args: Prisma.CanalTrafegoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CanalTrafegoPayload>
          }
          aggregate: {
            args: Prisma.CanalTrafegoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCanalTrafego>
          }
          groupBy: {
            args: Prisma.CanalTrafegoGroupByArgs<ExtArgs>
            result: $Utils.Optional<CanalTrafegoGroupByOutputType>[]
          }
          count: {
            args: Prisma.CanalTrafegoCountArgs<ExtArgs>
            result: $Utils.Optional<CanalTrafegoCountAggregateOutputType> | number
          }
        }
      }
      AnuncioCTR: {
        payload: Prisma.$AnuncioCTRPayload<ExtArgs>
        fields: Prisma.AnuncioCTRFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AnuncioCTRFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnuncioCTRPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AnuncioCTRFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnuncioCTRPayload>
          }
          findFirst: {
            args: Prisma.AnuncioCTRFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnuncioCTRPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AnuncioCTRFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnuncioCTRPayload>
          }
          findMany: {
            args: Prisma.AnuncioCTRFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnuncioCTRPayload>[]
          }
          create: {
            args: Prisma.AnuncioCTRCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnuncioCTRPayload>
          }
          createMany: {
            args: Prisma.AnuncioCTRCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AnuncioCTRCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnuncioCTRPayload>[]
          }
          delete: {
            args: Prisma.AnuncioCTRDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnuncioCTRPayload>
          }
          update: {
            args: Prisma.AnuncioCTRUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnuncioCTRPayload>
          }
          deleteMany: {
            args: Prisma.AnuncioCTRDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AnuncioCTRUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AnuncioCTRUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnuncioCTRPayload>[]
          }
          upsert: {
            args: Prisma.AnuncioCTRUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnuncioCTRPayload>
          }
          aggregate: {
            args: Prisma.AnuncioCTRAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAnuncioCTR>
          }
          groupBy: {
            args: Prisma.AnuncioCTRGroupByArgs<ExtArgs>
            result: $Utils.Optional<AnuncioCTRGroupByOutputType>[]
          }
          count: {
            args: Prisma.AnuncioCTRCountArgs<ExtArgs>
            result: $Utils.Optional<AnuncioCTRCountAggregateOutputType> | number
          }
        }
      }
      AnuncioConversao: {
        payload: Prisma.$AnuncioConversaoPayload<ExtArgs>
        fields: Prisma.AnuncioConversaoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AnuncioConversaoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnuncioConversaoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AnuncioConversaoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnuncioConversaoPayload>
          }
          findFirst: {
            args: Prisma.AnuncioConversaoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnuncioConversaoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AnuncioConversaoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnuncioConversaoPayload>
          }
          findMany: {
            args: Prisma.AnuncioConversaoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnuncioConversaoPayload>[]
          }
          create: {
            args: Prisma.AnuncioConversaoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnuncioConversaoPayload>
          }
          createMany: {
            args: Prisma.AnuncioConversaoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AnuncioConversaoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnuncioConversaoPayload>[]
          }
          delete: {
            args: Prisma.AnuncioConversaoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnuncioConversaoPayload>
          }
          update: {
            args: Prisma.AnuncioConversaoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnuncioConversaoPayload>
          }
          deleteMany: {
            args: Prisma.AnuncioConversaoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AnuncioConversaoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AnuncioConversaoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnuncioConversaoPayload>[]
          }
          upsert: {
            args: Prisma.AnuncioConversaoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnuncioConversaoPayload>
          }
          aggregate: {
            args: Prisma.AnuncioConversaoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAnuncioConversao>
          }
          groupBy: {
            args: Prisma.AnuncioConversaoGroupByArgs<ExtArgs>
            result: $Utils.Optional<AnuncioConversaoGroupByOutputType>[]
          }
          count: {
            args: Prisma.AnuncioConversaoCountArgs<ExtArgs>
            result: $Utils.Optional<AnuncioConversaoCountAggregateOutputType> | number
          }
        }
      }
      PalavraChave: {
        payload: Prisma.$PalavraChavePayload<ExtArgs>
        fields: Prisma.PalavraChaveFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PalavraChaveFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PalavraChavePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PalavraChaveFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PalavraChavePayload>
          }
          findFirst: {
            args: Prisma.PalavraChaveFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PalavraChavePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PalavraChaveFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PalavraChavePayload>
          }
          findMany: {
            args: Prisma.PalavraChaveFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PalavraChavePayload>[]
          }
          create: {
            args: Prisma.PalavraChaveCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PalavraChavePayload>
          }
          createMany: {
            args: Prisma.PalavraChaveCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PalavraChaveCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PalavraChavePayload>[]
          }
          delete: {
            args: Prisma.PalavraChaveDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PalavraChavePayload>
          }
          update: {
            args: Prisma.PalavraChaveUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PalavraChavePayload>
          }
          deleteMany: {
            args: Prisma.PalavraChaveDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PalavraChaveUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PalavraChaveUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PalavraChavePayload>[]
          }
          upsert: {
            args: Prisma.PalavraChaveUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PalavraChavePayload>
          }
          aggregate: {
            args: Prisma.PalavraChaveAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePalavraChave>
          }
          groupBy: {
            args: Prisma.PalavraChaveGroupByArgs<ExtArgs>
            result: $Utils.Optional<PalavraChaveGroupByOutputType>[]
          }
          count: {
            args: Prisma.PalavraChaveCountArgs<ExtArgs>
            result: $Utils.Optional<PalavraChaveCountAggregateOutputType> | number
          }
        }
      }
      DashboardComercial: {
        payload: Prisma.$DashboardComercialPayload<ExtArgs>
        fields: Prisma.DashboardComercialFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DashboardComercialFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DashboardComercialPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DashboardComercialFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DashboardComercialPayload>
          }
          findFirst: {
            args: Prisma.DashboardComercialFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DashboardComercialPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DashboardComercialFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DashboardComercialPayload>
          }
          findMany: {
            args: Prisma.DashboardComercialFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DashboardComercialPayload>[]
          }
          create: {
            args: Prisma.DashboardComercialCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DashboardComercialPayload>
          }
          createMany: {
            args: Prisma.DashboardComercialCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DashboardComercialCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DashboardComercialPayload>[]
          }
          delete: {
            args: Prisma.DashboardComercialDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DashboardComercialPayload>
          }
          update: {
            args: Prisma.DashboardComercialUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DashboardComercialPayload>
          }
          deleteMany: {
            args: Prisma.DashboardComercialDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DashboardComercialUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DashboardComercialUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DashboardComercialPayload>[]
          }
          upsert: {
            args: Prisma.DashboardComercialUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DashboardComercialPayload>
          }
          aggregate: {
            args: Prisma.DashboardComercialAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDashboardComercial>
          }
          groupBy: {
            args: Prisma.DashboardComercialGroupByArgs<ExtArgs>
            result: $Utils.Optional<DashboardComercialGroupByOutputType>[]
          }
          count: {
            args: Prisma.DashboardComercialCountArgs<ExtArgs>
            result: $Utils.Optional<DashboardComercialCountAggregateOutputType> | number
          }
        }
      }
      ReceitaCategoria: {
        payload: Prisma.$ReceitaCategoriaPayload<ExtArgs>
        fields: Prisma.ReceitaCategoriaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReceitaCategoriaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceitaCategoriaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReceitaCategoriaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceitaCategoriaPayload>
          }
          findFirst: {
            args: Prisma.ReceitaCategoriaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceitaCategoriaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReceitaCategoriaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceitaCategoriaPayload>
          }
          findMany: {
            args: Prisma.ReceitaCategoriaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceitaCategoriaPayload>[]
          }
          create: {
            args: Prisma.ReceitaCategoriaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceitaCategoriaPayload>
          }
          createMany: {
            args: Prisma.ReceitaCategoriaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReceitaCategoriaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceitaCategoriaPayload>[]
          }
          delete: {
            args: Prisma.ReceitaCategoriaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceitaCategoriaPayload>
          }
          update: {
            args: Prisma.ReceitaCategoriaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceitaCategoriaPayload>
          }
          deleteMany: {
            args: Prisma.ReceitaCategoriaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReceitaCategoriaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ReceitaCategoriaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceitaCategoriaPayload>[]
          }
          upsert: {
            args: Prisma.ReceitaCategoriaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceitaCategoriaPayload>
          }
          aggregate: {
            args: Prisma.ReceitaCategoriaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReceitaCategoria>
          }
          groupBy: {
            args: Prisma.ReceitaCategoriaGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReceitaCategoriaGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReceitaCategoriaCountArgs<ExtArgs>
            result: $Utils.Optional<ReceitaCategoriaCountAggregateOutputType> | number
          }
        }
      }
      ReceitaMetodoPagamento: {
        payload: Prisma.$ReceitaMetodoPagamentoPayload<ExtArgs>
        fields: Prisma.ReceitaMetodoPagamentoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReceitaMetodoPagamentoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceitaMetodoPagamentoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReceitaMetodoPagamentoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceitaMetodoPagamentoPayload>
          }
          findFirst: {
            args: Prisma.ReceitaMetodoPagamentoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceitaMetodoPagamentoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReceitaMetodoPagamentoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceitaMetodoPagamentoPayload>
          }
          findMany: {
            args: Prisma.ReceitaMetodoPagamentoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceitaMetodoPagamentoPayload>[]
          }
          create: {
            args: Prisma.ReceitaMetodoPagamentoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceitaMetodoPagamentoPayload>
          }
          createMany: {
            args: Prisma.ReceitaMetodoPagamentoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReceitaMetodoPagamentoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceitaMetodoPagamentoPayload>[]
          }
          delete: {
            args: Prisma.ReceitaMetodoPagamentoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceitaMetodoPagamentoPayload>
          }
          update: {
            args: Prisma.ReceitaMetodoPagamentoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceitaMetodoPagamentoPayload>
          }
          deleteMany: {
            args: Prisma.ReceitaMetodoPagamentoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReceitaMetodoPagamentoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ReceitaMetodoPagamentoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceitaMetodoPagamentoPayload>[]
          }
          upsert: {
            args: Prisma.ReceitaMetodoPagamentoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceitaMetodoPagamentoPayload>
          }
          aggregate: {
            args: Prisma.ReceitaMetodoPagamentoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReceitaMetodoPagamento>
          }
          groupBy: {
            args: Prisma.ReceitaMetodoPagamentoGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReceitaMetodoPagamentoGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReceitaMetodoPagamentoCountArgs<ExtArgs>
            result: $Utils.Optional<ReceitaMetodoPagamentoCountAggregateOutputType> | number
          }
        }
      }
      ClientesRecorrentesVsUnicos: {
        payload: Prisma.$ClientesRecorrentesVsUnicosPayload<ExtArgs>
        fields: Prisma.ClientesRecorrentesVsUnicosFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClientesRecorrentesVsUnicosFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientesRecorrentesVsUnicosPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClientesRecorrentesVsUnicosFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientesRecorrentesVsUnicosPayload>
          }
          findFirst: {
            args: Prisma.ClientesRecorrentesVsUnicosFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientesRecorrentesVsUnicosPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClientesRecorrentesVsUnicosFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientesRecorrentesVsUnicosPayload>
          }
          findMany: {
            args: Prisma.ClientesRecorrentesVsUnicosFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientesRecorrentesVsUnicosPayload>[]
          }
          create: {
            args: Prisma.ClientesRecorrentesVsUnicosCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientesRecorrentesVsUnicosPayload>
          }
          createMany: {
            args: Prisma.ClientesRecorrentesVsUnicosCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClientesRecorrentesVsUnicosCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientesRecorrentesVsUnicosPayload>[]
          }
          delete: {
            args: Prisma.ClientesRecorrentesVsUnicosDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientesRecorrentesVsUnicosPayload>
          }
          update: {
            args: Prisma.ClientesRecorrentesVsUnicosUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientesRecorrentesVsUnicosPayload>
          }
          deleteMany: {
            args: Prisma.ClientesRecorrentesVsUnicosDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClientesRecorrentesVsUnicosUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ClientesRecorrentesVsUnicosUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientesRecorrentesVsUnicosPayload>[]
          }
          upsert: {
            args: Prisma.ClientesRecorrentesVsUnicosUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientesRecorrentesVsUnicosPayload>
          }
          aggregate: {
            args: Prisma.ClientesRecorrentesVsUnicosAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClientesRecorrentesVsUnicos>
          }
          groupBy: {
            args: Prisma.ClientesRecorrentesVsUnicosGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClientesRecorrentesVsUnicosGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClientesRecorrentesVsUnicosCountArgs<ExtArgs>
            result: $Utils.Optional<ClientesRecorrentesVsUnicosCountAggregateOutputType> | number
          }
        }
      }
      ProdutoRank: {
        payload: Prisma.$ProdutoRankPayload<ExtArgs>
        fields: Prisma.ProdutoRankFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProdutoRankFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProdutoRankPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProdutoRankFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProdutoRankPayload>
          }
          findFirst: {
            args: Prisma.ProdutoRankFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProdutoRankPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProdutoRankFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProdutoRankPayload>
          }
          findMany: {
            args: Prisma.ProdutoRankFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProdutoRankPayload>[]
          }
          create: {
            args: Prisma.ProdutoRankCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProdutoRankPayload>
          }
          createMany: {
            args: Prisma.ProdutoRankCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProdutoRankCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProdutoRankPayload>[]
          }
          delete: {
            args: Prisma.ProdutoRankDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProdutoRankPayload>
          }
          update: {
            args: Prisma.ProdutoRankUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProdutoRankPayload>
          }
          deleteMany: {
            args: Prisma.ProdutoRankDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProdutoRankUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProdutoRankUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProdutoRankPayload>[]
          }
          upsert: {
            args: Prisma.ProdutoRankUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProdutoRankPayload>
          }
          aggregate: {
            args: Prisma.ProdutoRankAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProdutoRank>
          }
          groupBy: {
            args: Prisma.ProdutoRankGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProdutoRankGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProdutoRankCountArgs<ExtArgs>
            result: $Utils.Optional<ProdutoRankCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    organization?: OrganizationOmit
    user?: UserOmit
    pedido?: PedidoOmit
    dashboardMarketing?: DashboardMarketingOmit
    trafego?: TrafegoOmit
    canalTrafego?: CanalTrafegoOmit
    anuncioCTR?: AnuncioCTROmit
    anuncioConversao?: AnuncioConversaoOmit
    palavraChave?: PalavraChaveOmit
    dashboardComercial?: DashboardComercialOmit
    receitaCategoria?: ReceitaCategoriaOmit
    receitaMetodoPagamento?: ReceitaMetodoPagamentoOmit
    clientesRecorrentesVsUnicos?: ClientesRecorrentesVsUnicosOmit
    produtoRank?: ProdutoRankOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type OrganizationCountOutputType
   */

  export type OrganizationCountOutputType = {
    users: number
  }

  export type OrganizationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | OrganizationCountOutputTypeCountUsersArgs
  }

  // Custom InputTypes
  /**
   * OrganizationCountOutputType without action
   */
  export type OrganizationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationCountOutputType
     */
    select?: OrganizationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * OrganizationCountOutputType without action
   */
  export type OrganizationCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }


  /**
   * Count Type DashboardMarketingCountOutputType
   */

  export type DashboardMarketingCountOutputType = {
    anunciosCTR: number
    anunciosConv: number
    canais: number
    palavrasChave: number
    trafego: number
  }

  export type DashboardMarketingCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    anunciosCTR?: boolean | DashboardMarketingCountOutputTypeCountAnunciosCTRArgs
    anunciosConv?: boolean | DashboardMarketingCountOutputTypeCountAnunciosConvArgs
    canais?: boolean | DashboardMarketingCountOutputTypeCountCanaisArgs
    palavrasChave?: boolean | DashboardMarketingCountOutputTypeCountPalavrasChaveArgs
    trafego?: boolean | DashboardMarketingCountOutputTypeCountTrafegoArgs
  }

  // Custom InputTypes
  /**
   * DashboardMarketingCountOutputType without action
   */
  export type DashboardMarketingCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardMarketingCountOutputType
     */
    select?: DashboardMarketingCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DashboardMarketingCountOutputType without action
   */
  export type DashboardMarketingCountOutputTypeCountAnunciosCTRArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnuncioCTRWhereInput
  }

  /**
   * DashboardMarketingCountOutputType without action
   */
  export type DashboardMarketingCountOutputTypeCountAnunciosConvArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnuncioConversaoWhereInput
  }

  /**
   * DashboardMarketingCountOutputType without action
   */
  export type DashboardMarketingCountOutputTypeCountCanaisArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CanalTrafegoWhereInput
  }

  /**
   * DashboardMarketingCountOutputType without action
   */
  export type DashboardMarketingCountOutputTypeCountPalavrasChaveArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PalavraChaveWhereInput
  }

  /**
   * DashboardMarketingCountOutputType without action
   */
  export type DashboardMarketingCountOutputTypeCountTrafegoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrafegoWhereInput
  }


  /**
   * Count Type DashboardComercialCountOutputType
   */

  export type DashboardComercialCountOutputType = {
    clientesComparacao: number
    produtosTop: number
    receitaPorCategoria: number
    receitaPorPagamento: number
  }

  export type DashboardComercialCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clientesComparacao?: boolean | DashboardComercialCountOutputTypeCountClientesComparacaoArgs
    produtosTop?: boolean | DashboardComercialCountOutputTypeCountProdutosTopArgs
    receitaPorCategoria?: boolean | DashboardComercialCountOutputTypeCountReceitaPorCategoriaArgs
    receitaPorPagamento?: boolean | DashboardComercialCountOutputTypeCountReceitaPorPagamentoArgs
  }

  // Custom InputTypes
  /**
   * DashboardComercialCountOutputType without action
   */
  export type DashboardComercialCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardComercialCountOutputType
     */
    select?: DashboardComercialCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DashboardComercialCountOutputType without action
   */
  export type DashboardComercialCountOutputTypeCountClientesComparacaoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClientesRecorrentesVsUnicosWhereInput
  }

  /**
   * DashboardComercialCountOutputType without action
   */
  export type DashboardComercialCountOutputTypeCountProdutosTopArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProdutoRankWhereInput
  }

  /**
   * DashboardComercialCountOutputType without action
   */
  export type DashboardComercialCountOutputTypeCountReceitaPorCategoriaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReceitaCategoriaWhereInput
  }

  /**
   * DashboardComercialCountOutputType without action
   */
  export type DashboardComercialCountOutputTypeCountReceitaPorPagamentoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReceitaMetodoPagamentoWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Organization
   */

  export type AggregateOrganization = {
    _count: OrganizationCountAggregateOutputType | null
    _avg: OrganizationAvgAggregateOutputType | null
    _sum: OrganizationSumAggregateOutputType | null
    _min: OrganizationMinAggregateOutputType | null
    _max: OrganizationMaxAggregateOutputType | null
  }

  export type OrganizationAvgAggregateOutputType = {
    googleExpiresIn: number | null
  }

  export type OrganizationSumAggregateOutputType = {
    googleExpiresIn: number | null
  }

  export type OrganizationMinAggregateOutputType = {
    id: string | null
    name: string | null
    googleAccessToken: string | null
    googleRefreshToken: string | null
    googleScopes: string | null
    createdAt: Date | null
    updatedAt: Date | null
    googleExpiresIn: number | null
  }

  export type OrganizationMaxAggregateOutputType = {
    id: string | null
    name: string | null
    googleAccessToken: string | null
    googleRefreshToken: string | null
    googleScopes: string | null
    createdAt: Date | null
    updatedAt: Date | null
    googleExpiresIn: number | null
  }

  export type OrganizationCountAggregateOutputType = {
    id: number
    name: number
    googleAccessToken: number
    googleRefreshToken: number
    googleScopes: number
    createdAt: number
    updatedAt: number
    googleExpiresIn: number
    _all: number
  }


  export type OrganizationAvgAggregateInputType = {
    googleExpiresIn?: true
  }

  export type OrganizationSumAggregateInputType = {
    googleExpiresIn?: true
  }

  export type OrganizationMinAggregateInputType = {
    id?: true
    name?: true
    googleAccessToken?: true
    googleRefreshToken?: true
    googleScopes?: true
    createdAt?: true
    updatedAt?: true
    googleExpiresIn?: true
  }

  export type OrganizationMaxAggregateInputType = {
    id?: true
    name?: true
    googleAccessToken?: true
    googleRefreshToken?: true
    googleScopes?: true
    createdAt?: true
    updatedAt?: true
    googleExpiresIn?: true
  }

  export type OrganizationCountAggregateInputType = {
    id?: true
    name?: true
    googleAccessToken?: true
    googleRefreshToken?: true
    googleScopes?: true
    createdAt?: true
    updatedAt?: true
    googleExpiresIn?: true
    _all?: true
  }

  export type OrganizationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Organization to aggregate.
     */
    where?: OrganizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organizations to fetch.
     */
    orderBy?: OrganizationOrderByWithRelationInput | OrganizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrganizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Organizations
    **/
    _count?: true | OrganizationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OrganizationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OrganizationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrganizationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrganizationMaxAggregateInputType
  }

  export type GetOrganizationAggregateType<T extends OrganizationAggregateArgs> = {
        [P in keyof T & keyof AggregateOrganization]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrganization[P]>
      : GetScalarType<T[P], AggregateOrganization[P]>
  }




  export type OrganizationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrganizationWhereInput
    orderBy?: OrganizationOrderByWithAggregationInput | OrganizationOrderByWithAggregationInput[]
    by: OrganizationScalarFieldEnum[] | OrganizationScalarFieldEnum
    having?: OrganizationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrganizationCountAggregateInputType | true
    _avg?: OrganizationAvgAggregateInputType
    _sum?: OrganizationSumAggregateInputType
    _min?: OrganizationMinAggregateInputType
    _max?: OrganizationMaxAggregateInputType
  }

  export type OrganizationGroupByOutputType = {
    id: string
    name: string
    googleAccessToken: string | null
    googleRefreshToken: string | null
    googleScopes: string | null
    createdAt: Date
    updatedAt: Date
    googleExpiresIn: number | null
    _count: OrganizationCountAggregateOutputType | null
    _avg: OrganizationAvgAggregateOutputType | null
    _sum: OrganizationSumAggregateOutputType | null
    _min: OrganizationMinAggregateOutputType | null
    _max: OrganizationMaxAggregateOutputType | null
  }

  type GetOrganizationGroupByPayload<T extends OrganizationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrganizationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrganizationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrganizationGroupByOutputType[P]>
            : GetScalarType<T[P], OrganizationGroupByOutputType[P]>
        }
      >
    >


  export type OrganizationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    googleAccessToken?: boolean
    googleRefreshToken?: boolean
    googleScopes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    googleExpiresIn?: boolean
    dashboardComercial?: boolean | Organization$dashboardComercialArgs<ExtArgs>
    dashboardMarketing?: boolean | Organization$dashboardMarketingArgs<ExtArgs>
    users?: boolean | Organization$usersArgs<ExtArgs>
    _count?: boolean | OrganizationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["organization"]>

  export type OrganizationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    googleAccessToken?: boolean
    googleRefreshToken?: boolean
    googleScopes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    googleExpiresIn?: boolean
  }, ExtArgs["result"]["organization"]>

  export type OrganizationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    googleAccessToken?: boolean
    googleRefreshToken?: boolean
    googleScopes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    googleExpiresIn?: boolean
  }, ExtArgs["result"]["organization"]>

  export type OrganizationSelectScalar = {
    id?: boolean
    name?: boolean
    googleAccessToken?: boolean
    googleRefreshToken?: boolean
    googleScopes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    googleExpiresIn?: boolean
  }

  export type OrganizationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "googleAccessToken" | "googleRefreshToken" | "googleScopes" | "createdAt" | "updatedAt" | "googleExpiresIn", ExtArgs["result"]["organization"]>
  export type OrganizationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dashboardComercial?: boolean | Organization$dashboardComercialArgs<ExtArgs>
    dashboardMarketing?: boolean | Organization$dashboardMarketingArgs<ExtArgs>
    users?: boolean | Organization$usersArgs<ExtArgs>
    _count?: boolean | OrganizationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type OrganizationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type OrganizationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $OrganizationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Organization"
    objects: {
      dashboardComercial: Prisma.$DashboardComercialPayload<ExtArgs> | null
      dashboardMarketing: Prisma.$DashboardMarketingPayload<ExtArgs> | null
      users: Prisma.$UserPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      googleAccessToken: string | null
      googleRefreshToken: string | null
      googleScopes: string | null
      createdAt: Date
      updatedAt: Date
      googleExpiresIn: number | null
    }, ExtArgs["result"]["organization"]>
    composites: {}
  }

  type OrganizationGetPayload<S extends boolean | null | undefined | OrganizationDefaultArgs> = $Result.GetResult<Prisma.$OrganizationPayload, S>

  type OrganizationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OrganizationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OrganizationCountAggregateInputType | true
    }

  export interface OrganizationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Organization'], meta: { name: 'Organization' } }
    /**
     * Find zero or one Organization that matches the filter.
     * @param {OrganizationFindUniqueArgs} args - Arguments to find a Organization
     * @example
     * // Get one Organization
     * const organization = await prisma.organization.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrganizationFindUniqueArgs>(args: SelectSubset<T, OrganizationFindUniqueArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Organization that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OrganizationFindUniqueOrThrowArgs} args - Arguments to find a Organization
     * @example
     * // Get one Organization
     * const organization = await prisma.organization.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrganizationFindUniqueOrThrowArgs>(args: SelectSubset<T, OrganizationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Organization that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationFindFirstArgs} args - Arguments to find a Organization
     * @example
     * // Get one Organization
     * const organization = await prisma.organization.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrganizationFindFirstArgs>(args?: SelectSubset<T, OrganizationFindFirstArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Organization that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationFindFirstOrThrowArgs} args - Arguments to find a Organization
     * @example
     * // Get one Organization
     * const organization = await prisma.organization.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrganizationFindFirstOrThrowArgs>(args?: SelectSubset<T, OrganizationFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Organizations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Organizations
     * const organizations = await prisma.organization.findMany()
     * 
     * // Get first 10 Organizations
     * const organizations = await prisma.organization.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const organizationWithIdOnly = await prisma.organization.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrganizationFindManyArgs>(args?: SelectSubset<T, OrganizationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Organization.
     * @param {OrganizationCreateArgs} args - Arguments to create a Organization.
     * @example
     * // Create one Organization
     * const Organization = await prisma.organization.create({
     *   data: {
     *     // ... data to create a Organization
     *   }
     * })
     * 
     */
    create<T extends OrganizationCreateArgs>(args: SelectSubset<T, OrganizationCreateArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Organizations.
     * @param {OrganizationCreateManyArgs} args - Arguments to create many Organizations.
     * @example
     * // Create many Organizations
     * const organization = await prisma.organization.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrganizationCreateManyArgs>(args?: SelectSubset<T, OrganizationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Organizations and returns the data saved in the database.
     * @param {OrganizationCreateManyAndReturnArgs} args - Arguments to create many Organizations.
     * @example
     * // Create many Organizations
     * const organization = await prisma.organization.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Organizations and only return the `id`
     * const organizationWithIdOnly = await prisma.organization.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrganizationCreateManyAndReturnArgs>(args?: SelectSubset<T, OrganizationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Organization.
     * @param {OrganizationDeleteArgs} args - Arguments to delete one Organization.
     * @example
     * // Delete one Organization
     * const Organization = await prisma.organization.delete({
     *   where: {
     *     // ... filter to delete one Organization
     *   }
     * })
     * 
     */
    delete<T extends OrganizationDeleteArgs>(args: SelectSubset<T, OrganizationDeleteArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Organization.
     * @param {OrganizationUpdateArgs} args - Arguments to update one Organization.
     * @example
     * // Update one Organization
     * const organization = await prisma.organization.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrganizationUpdateArgs>(args: SelectSubset<T, OrganizationUpdateArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Organizations.
     * @param {OrganizationDeleteManyArgs} args - Arguments to filter Organizations to delete.
     * @example
     * // Delete a few Organizations
     * const { count } = await prisma.organization.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrganizationDeleteManyArgs>(args?: SelectSubset<T, OrganizationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Organizations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Organizations
     * const organization = await prisma.organization.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrganizationUpdateManyArgs>(args: SelectSubset<T, OrganizationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Organizations and returns the data updated in the database.
     * @param {OrganizationUpdateManyAndReturnArgs} args - Arguments to update many Organizations.
     * @example
     * // Update many Organizations
     * const organization = await prisma.organization.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Organizations and only return the `id`
     * const organizationWithIdOnly = await prisma.organization.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OrganizationUpdateManyAndReturnArgs>(args: SelectSubset<T, OrganizationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Organization.
     * @param {OrganizationUpsertArgs} args - Arguments to update or create a Organization.
     * @example
     * // Update or create a Organization
     * const organization = await prisma.organization.upsert({
     *   create: {
     *     // ... data to create a Organization
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Organization we want to update
     *   }
     * })
     */
    upsert<T extends OrganizationUpsertArgs>(args: SelectSubset<T, OrganizationUpsertArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Organizations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationCountArgs} args - Arguments to filter Organizations to count.
     * @example
     * // Count the number of Organizations
     * const count = await prisma.organization.count({
     *   where: {
     *     // ... the filter for the Organizations we want to count
     *   }
     * })
    **/
    count<T extends OrganizationCountArgs>(
      args?: Subset<T, OrganizationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrganizationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Organization.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrganizationAggregateArgs>(args: Subset<T, OrganizationAggregateArgs>): Prisma.PrismaPromise<GetOrganizationAggregateType<T>>

    /**
     * Group by Organization.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OrganizationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrganizationGroupByArgs['orderBy'] }
        : { orderBy?: OrganizationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OrganizationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrganizationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Organization model
   */
  readonly fields: OrganizationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Organization.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrganizationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    dashboardComercial<T extends Organization$dashboardComercialArgs<ExtArgs> = {}>(args?: Subset<T, Organization$dashboardComercialArgs<ExtArgs>>): Prisma__DashboardComercialClient<$Result.GetResult<Prisma.$DashboardComercialPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    dashboardMarketing<T extends Organization$dashboardMarketingArgs<ExtArgs> = {}>(args?: Subset<T, Organization$dashboardMarketingArgs<ExtArgs>>): Prisma__DashboardMarketingClient<$Result.GetResult<Prisma.$DashboardMarketingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    users<T extends Organization$usersArgs<ExtArgs> = {}>(args?: Subset<T, Organization$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Organization model
   */
  interface OrganizationFieldRefs {
    readonly id: FieldRef<"Organization", 'String'>
    readonly name: FieldRef<"Organization", 'String'>
    readonly googleAccessToken: FieldRef<"Organization", 'String'>
    readonly googleRefreshToken: FieldRef<"Organization", 'String'>
    readonly googleScopes: FieldRef<"Organization", 'String'>
    readonly createdAt: FieldRef<"Organization", 'DateTime'>
    readonly updatedAt: FieldRef<"Organization", 'DateTime'>
    readonly googleExpiresIn: FieldRef<"Organization", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * Organization findUnique
   */
  export type OrganizationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organization to fetch.
     */
    where: OrganizationWhereUniqueInput
  }

  /**
   * Organization findUniqueOrThrow
   */
  export type OrganizationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organization to fetch.
     */
    where: OrganizationWhereUniqueInput
  }

  /**
   * Organization findFirst
   */
  export type OrganizationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organization to fetch.
     */
    where?: OrganizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organizations to fetch.
     */
    orderBy?: OrganizationOrderByWithRelationInput | OrganizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Organizations.
     */
    cursor?: OrganizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Organizations.
     */
    distinct?: OrganizationScalarFieldEnum | OrganizationScalarFieldEnum[]
  }

  /**
   * Organization findFirstOrThrow
   */
  export type OrganizationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organization to fetch.
     */
    where?: OrganizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organizations to fetch.
     */
    orderBy?: OrganizationOrderByWithRelationInput | OrganizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Organizations.
     */
    cursor?: OrganizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Organizations.
     */
    distinct?: OrganizationScalarFieldEnum | OrganizationScalarFieldEnum[]
  }

  /**
   * Organization findMany
   */
  export type OrganizationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organizations to fetch.
     */
    where?: OrganizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organizations to fetch.
     */
    orderBy?: OrganizationOrderByWithRelationInput | OrganizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Organizations.
     */
    cursor?: OrganizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organizations.
     */
    skip?: number
    distinct?: OrganizationScalarFieldEnum | OrganizationScalarFieldEnum[]
  }

  /**
   * Organization create
   */
  export type OrganizationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * The data needed to create a Organization.
     */
    data: XOR<OrganizationCreateInput, OrganizationUncheckedCreateInput>
  }

  /**
   * Organization createMany
   */
  export type OrganizationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Organizations.
     */
    data: OrganizationCreateManyInput | OrganizationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Organization createManyAndReturn
   */
  export type OrganizationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * The data used to create many Organizations.
     */
    data: OrganizationCreateManyInput | OrganizationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Organization update
   */
  export type OrganizationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * The data needed to update a Organization.
     */
    data: XOR<OrganizationUpdateInput, OrganizationUncheckedUpdateInput>
    /**
     * Choose, which Organization to update.
     */
    where: OrganizationWhereUniqueInput
  }

  /**
   * Organization updateMany
   */
  export type OrganizationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Organizations.
     */
    data: XOR<OrganizationUpdateManyMutationInput, OrganizationUncheckedUpdateManyInput>
    /**
     * Filter which Organizations to update
     */
    where?: OrganizationWhereInput
    /**
     * Limit how many Organizations to update.
     */
    limit?: number
  }

  /**
   * Organization updateManyAndReturn
   */
  export type OrganizationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * The data used to update Organizations.
     */
    data: XOR<OrganizationUpdateManyMutationInput, OrganizationUncheckedUpdateManyInput>
    /**
     * Filter which Organizations to update
     */
    where?: OrganizationWhereInput
    /**
     * Limit how many Organizations to update.
     */
    limit?: number
  }

  /**
   * Organization upsert
   */
  export type OrganizationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * The filter to search for the Organization to update in case it exists.
     */
    where: OrganizationWhereUniqueInput
    /**
     * In case the Organization found by the `where` argument doesn't exist, create a new Organization with this data.
     */
    create: XOR<OrganizationCreateInput, OrganizationUncheckedCreateInput>
    /**
     * In case the Organization was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrganizationUpdateInput, OrganizationUncheckedUpdateInput>
  }

  /**
   * Organization delete
   */
  export type OrganizationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter which Organization to delete.
     */
    where: OrganizationWhereUniqueInput
  }

  /**
   * Organization deleteMany
   */
  export type OrganizationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Organizations to delete
     */
    where?: OrganizationWhereInput
    /**
     * Limit how many Organizations to delete.
     */
    limit?: number
  }

  /**
   * Organization.dashboardComercial
   */
  export type Organization$dashboardComercialArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardComercial
     */
    select?: DashboardComercialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DashboardComercial
     */
    omit?: DashboardComercialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DashboardComercialInclude<ExtArgs> | null
    where?: DashboardComercialWhereInput
  }

  /**
   * Organization.dashboardMarketing
   */
  export type Organization$dashboardMarketingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardMarketing
     */
    select?: DashboardMarketingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DashboardMarketing
     */
    omit?: DashboardMarketingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DashboardMarketingInclude<ExtArgs> | null
    where?: DashboardMarketingWhereInput
  }

  /**
   * Organization.users
   */
  export type Organization$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Organization without action
   */
  export type OrganizationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    password: string | null
    role: $Enums.Role | null
    createdAt: Date | null
    updatedAt: Date | null
    organizationId: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    password: string | null
    role: $Enums.Role | null
    createdAt: Date | null
    updatedAt: Date | null
    organizationId: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    password: number
    role: number
    createdAt: number
    updatedAt: number
    organizationId: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    organizationId?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    organizationId?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    organizationId?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    email: string
    password: string
    role: $Enums.Role
    createdAt: Date
    updatedAt: Date
    organizationId: string
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    organizationId?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    organizationId?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    organizationId?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    organizationId?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "password" | "role" | "createdAt" | "updatedAt" | "organizationId", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      organization: Prisma.$OrganizationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      password: string
      role: $Enums.Role
      createdAt: Date
      updatedAt: Date
      organizationId: string
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    organization<T extends OrganizationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrganizationDefaultArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly organizationId: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Pedido
   */

  export type AggregatePedido = {
    _count: PedidoCountAggregateOutputType | null
    _avg: PedidoAvgAggregateOutputType | null
    _sum: PedidoSumAggregateOutputType | null
    _min: PedidoMinAggregateOutputType | null
    _max: PedidoMaxAggregateOutputType | null
  }

  export type PedidoAvgAggregateOutputType = {
    precoUnitario: Decimal | null
    quantidade: Decimal | null
    valorTotal: Decimal | null
  }

  export type PedidoSumAggregateOutputType = {
    precoUnitario: Decimal | null
    quantidade: Decimal | null
    valorTotal: Decimal | null
  }

  export type PedidoMinAggregateOutputType = {
    id: string | null
    dataPedido: Date | null
    dataAprovacao: Date | null
    cancelada: boolean | null
    faturado: boolean | null
    codigoPedido: string | null
    codigoProduto: string | null
    setor: string | null
    produto: string | null
    precoUnitario: Decimal | null
    quantidade: Decimal | null
    valorTotal: Decimal | null
    cliente: string | null
    vendedor: string | null
  }

  export type PedidoMaxAggregateOutputType = {
    id: string | null
    dataPedido: Date | null
    dataAprovacao: Date | null
    cancelada: boolean | null
    faturado: boolean | null
    codigoPedido: string | null
    codigoProduto: string | null
    setor: string | null
    produto: string | null
    precoUnitario: Decimal | null
    quantidade: Decimal | null
    valorTotal: Decimal | null
    cliente: string | null
    vendedor: string | null
  }

  export type PedidoCountAggregateOutputType = {
    id: number
    dataPedido: number
    dataAprovacao: number
    cancelada: number
    faturado: number
    codigoPedido: number
    codigoProduto: number
    setor: number
    produto: number
    precoUnitario: number
    quantidade: number
    valorTotal: number
    cliente: number
    vendedor: number
    _all: number
  }


  export type PedidoAvgAggregateInputType = {
    precoUnitario?: true
    quantidade?: true
    valorTotal?: true
  }

  export type PedidoSumAggregateInputType = {
    precoUnitario?: true
    quantidade?: true
    valorTotal?: true
  }

  export type PedidoMinAggregateInputType = {
    id?: true
    dataPedido?: true
    dataAprovacao?: true
    cancelada?: true
    faturado?: true
    codigoPedido?: true
    codigoProduto?: true
    setor?: true
    produto?: true
    precoUnitario?: true
    quantidade?: true
    valorTotal?: true
    cliente?: true
    vendedor?: true
  }

  export type PedidoMaxAggregateInputType = {
    id?: true
    dataPedido?: true
    dataAprovacao?: true
    cancelada?: true
    faturado?: true
    codigoPedido?: true
    codigoProduto?: true
    setor?: true
    produto?: true
    precoUnitario?: true
    quantidade?: true
    valorTotal?: true
    cliente?: true
    vendedor?: true
  }

  export type PedidoCountAggregateInputType = {
    id?: true
    dataPedido?: true
    dataAprovacao?: true
    cancelada?: true
    faturado?: true
    codigoPedido?: true
    codigoProduto?: true
    setor?: true
    produto?: true
    precoUnitario?: true
    quantidade?: true
    valorTotal?: true
    cliente?: true
    vendedor?: true
    _all?: true
  }

  export type PedidoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Pedido to aggregate.
     */
    where?: PedidoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pedidos to fetch.
     */
    orderBy?: PedidoOrderByWithRelationInput | PedidoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PedidoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pedidos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pedidos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Pedidos
    **/
    _count?: true | PedidoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PedidoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PedidoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PedidoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PedidoMaxAggregateInputType
  }

  export type GetPedidoAggregateType<T extends PedidoAggregateArgs> = {
        [P in keyof T & keyof AggregatePedido]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePedido[P]>
      : GetScalarType<T[P], AggregatePedido[P]>
  }




  export type PedidoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PedidoWhereInput
    orderBy?: PedidoOrderByWithAggregationInput | PedidoOrderByWithAggregationInput[]
    by: PedidoScalarFieldEnum[] | PedidoScalarFieldEnum
    having?: PedidoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PedidoCountAggregateInputType | true
    _avg?: PedidoAvgAggregateInputType
    _sum?: PedidoSumAggregateInputType
    _min?: PedidoMinAggregateInputType
    _max?: PedidoMaxAggregateInputType
  }

  export type PedidoGroupByOutputType = {
    id: string
    dataPedido: Date
    dataAprovacao: Date
    cancelada: boolean
    faturado: boolean
    codigoPedido: string
    codigoProduto: string
    setor: string
    produto: string
    precoUnitario: Decimal
    quantidade: Decimal
    valorTotal: Decimal
    cliente: string
    vendedor: string
    _count: PedidoCountAggregateOutputType | null
    _avg: PedidoAvgAggregateOutputType | null
    _sum: PedidoSumAggregateOutputType | null
    _min: PedidoMinAggregateOutputType | null
    _max: PedidoMaxAggregateOutputType | null
  }

  type GetPedidoGroupByPayload<T extends PedidoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PedidoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PedidoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PedidoGroupByOutputType[P]>
            : GetScalarType<T[P], PedidoGroupByOutputType[P]>
        }
      >
    >


  export type PedidoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dataPedido?: boolean
    dataAprovacao?: boolean
    cancelada?: boolean
    faturado?: boolean
    codigoPedido?: boolean
    codigoProduto?: boolean
    setor?: boolean
    produto?: boolean
    precoUnitario?: boolean
    quantidade?: boolean
    valorTotal?: boolean
    cliente?: boolean
    vendedor?: boolean
  }, ExtArgs["result"]["pedido"]>

  export type PedidoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dataPedido?: boolean
    dataAprovacao?: boolean
    cancelada?: boolean
    faturado?: boolean
    codigoPedido?: boolean
    codigoProduto?: boolean
    setor?: boolean
    produto?: boolean
    precoUnitario?: boolean
    quantidade?: boolean
    valorTotal?: boolean
    cliente?: boolean
    vendedor?: boolean
  }, ExtArgs["result"]["pedido"]>

  export type PedidoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dataPedido?: boolean
    dataAprovacao?: boolean
    cancelada?: boolean
    faturado?: boolean
    codigoPedido?: boolean
    codigoProduto?: boolean
    setor?: boolean
    produto?: boolean
    precoUnitario?: boolean
    quantidade?: boolean
    valorTotal?: boolean
    cliente?: boolean
    vendedor?: boolean
  }, ExtArgs["result"]["pedido"]>

  export type PedidoSelectScalar = {
    id?: boolean
    dataPedido?: boolean
    dataAprovacao?: boolean
    cancelada?: boolean
    faturado?: boolean
    codigoPedido?: boolean
    codigoProduto?: boolean
    setor?: boolean
    produto?: boolean
    precoUnitario?: boolean
    quantidade?: boolean
    valorTotal?: boolean
    cliente?: boolean
    vendedor?: boolean
  }

  export type PedidoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "dataPedido" | "dataAprovacao" | "cancelada" | "faturado" | "codigoPedido" | "codigoProduto" | "setor" | "produto" | "precoUnitario" | "quantidade" | "valorTotal" | "cliente" | "vendedor", ExtArgs["result"]["pedido"]>

  export type $PedidoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Pedido"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      dataPedido: Date
      dataAprovacao: Date
      cancelada: boolean
      faturado: boolean
      codigoPedido: string
      codigoProduto: string
      setor: string
      produto: string
      precoUnitario: Prisma.Decimal
      quantidade: Prisma.Decimal
      valorTotal: Prisma.Decimal
      cliente: string
      vendedor: string
    }, ExtArgs["result"]["pedido"]>
    composites: {}
  }

  type PedidoGetPayload<S extends boolean | null | undefined | PedidoDefaultArgs> = $Result.GetResult<Prisma.$PedidoPayload, S>

  type PedidoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PedidoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PedidoCountAggregateInputType | true
    }

  export interface PedidoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Pedido'], meta: { name: 'Pedido' } }
    /**
     * Find zero or one Pedido that matches the filter.
     * @param {PedidoFindUniqueArgs} args - Arguments to find a Pedido
     * @example
     * // Get one Pedido
     * const pedido = await prisma.pedido.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PedidoFindUniqueArgs>(args: SelectSubset<T, PedidoFindUniqueArgs<ExtArgs>>): Prisma__PedidoClient<$Result.GetResult<Prisma.$PedidoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Pedido that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PedidoFindUniqueOrThrowArgs} args - Arguments to find a Pedido
     * @example
     * // Get one Pedido
     * const pedido = await prisma.pedido.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PedidoFindUniqueOrThrowArgs>(args: SelectSubset<T, PedidoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PedidoClient<$Result.GetResult<Prisma.$PedidoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pedido that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PedidoFindFirstArgs} args - Arguments to find a Pedido
     * @example
     * // Get one Pedido
     * const pedido = await prisma.pedido.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PedidoFindFirstArgs>(args?: SelectSubset<T, PedidoFindFirstArgs<ExtArgs>>): Prisma__PedidoClient<$Result.GetResult<Prisma.$PedidoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pedido that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PedidoFindFirstOrThrowArgs} args - Arguments to find a Pedido
     * @example
     * // Get one Pedido
     * const pedido = await prisma.pedido.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PedidoFindFirstOrThrowArgs>(args?: SelectSubset<T, PedidoFindFirstOrThrowArgs<ExtArgs>>): Prisma__PedidoClient<$Result.GetResult<Prisma.$PedidoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Pedidos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PedidoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Pedidos
     * const pedidos = await prisma.pedido.findMany()
     * 
     * // Get first 10 Pedidos
     * const pedidos = await prisma.pedido.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pedidoWithIdOnly = await prisma.pedido.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PedidoFindManyArgs>(args?: SelectSubset<T, PedidoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PedidoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Pedido.
     * @param {PedidoCreateArgs} args - Arguments to create a Pedido.
     * @example
     * // Create one Pedido
     * const Pedido = await prisma.pedido.create({
     *   data: {
     *     // ... data to create a Pedido
     *   }
     * })
     * 
     */
    create<T extends PedidoCreateArgs>(args: SelectSubset<T, PedidoCreateArgs<ExtArgs>>): Prisma__PedidoClient<$Result.GetResult<Prisma.$PedidoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Pedidos.
     * @param {PedidoCreateManyArgs} args - Arguments to create many Pedidos.
     * @example
     * // Create many Pedidos
     * const pedido = await prisma.pedido.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PedidoCreateManyArgs>(args?: SelectSubset<T, PedidoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Pedidos and returns the data saved in the database.
     * @param {PedidoCreateManyAndReturnArgs} args - Arguments to create many Pedidos.
     * @example
     * // Create many Pedidos
     * const pedido = await prisma.pedido.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Pedidos and only return the `id`
     * const pedidoWithIdOnly = await prisma.pedido.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PedidoCreateManyAndReturnArgs>(args?: SelectSubset<T, PedidoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PedidoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Pedido.
     * @param {PedidoDeleteArgs} args - Arguments to delete one Pedido.
     * @example
     * // Delete one Pedido
     * const Pedido = await prisma.pedido.delete({
     *   where: {
     *     // ... filter to delete one Pedido
     *   }
     * })
     * 
     */
    delete<T extends PedidoDeleteArgs>(args: SelectSubset<T, PedidoDeleteArgs<ExtArgs>>): Prisma__PedidoClient<$Result.GetResult<Prisma.$PedidoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Pedido.
     * @param {PedidoUpdateArgs} args - Arguments to update one Pedido.
     * @example
     * // Update one Pedido
     * const pedido = await prisma.pedido.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PedidoUpdateArgs>(args: SelectSubset<T, PedidoUpdateArgs<ExtArgs>>): Prisma__PedidoClient<$Result.GetResult<Prisma.$PedidoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Pedidos.
     * @param {PedidoDeleteManyArgs} args - Arguments to filter Pedidos to delete.
     * @example
     * // Delete a few Pedidos
     * const { count } = await prisma.pedido.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PedidoDeleteManyArgs>(args?: SelectSubset<T, PedidoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pedidos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PedidoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Pedidos
     * const pedido = await prisma.pedido.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PedidoUpdateManyArgs>(args: SelectSubset<T, PedidoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pedidos and returns the data updated in the database.
     * @param {PedidoUpdateManyAndReturnArgs} args - Arguments to update many Pedidos.
     * @example
     * // Update many Pedidos
     * const pedido = await prisma.pedido.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Pedidos and only return the `id`
     * const pedidoWithIdOnly = await prisma.pedido.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PedidoUpdateManyAndReturnArgs>(args: SelectSubset<T, PedidoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PedidoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Pedido.
     * @param {PedidoUpsertArgs} args - Arguments to update or create a Pedido.
     * @example
     * // Update or create a Pedido
     * const pedido = await prisma.pedido.upsert({
     *   create: {
     *     // ... data to create a Pedido
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Pedido we want to update
     *   }
     * })
     */
    upsert<T extends PedidoUpsertArgs>(args: SelectSubset<T, PedidoUpsertArgs<ExtArgs>>): Prisma__PedidoClient<$Result.GetResult<Prisma.$PedidoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Pedidos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PedidoCountArgs} args - Arguments to filter Pedidos to count.
     * @example
     * // Count the number of Pedidos
     * const count = await prisma.pedido.count({
     *   where: {
     *     // ... the filter for the Pedidos we want to count
     *   }
     * })
    **/
    count<T extends PedidoCountArgs>(
      args?: Subset<T, PedidoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PedidoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Pedido.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PedidoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PedidoAggregateArgs>(args: Subset<T, PedidoAggregateArgs>): Prisma.PrismaPromise<GetPedidoAggregateType<T>>

    /**
     * Group by Pedido.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PedidoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PedidoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PedidoGroupByArgs['orderBy'] }
        : { orderBy?: PedidoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PedidoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPedidoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Pedido model
   */
  readonly fields: PedidoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Pedido.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PedidoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Pedido model
   */
  interface PedidoFieldRefs {
    readonly id: FieldRef<"Pedido", 'String'>
    readonly dataPedido: FieldRef<"Pedido", 'DateTime'>
    readonly dataAprovacao: FieldRef<"Pedido", 'DateTime'>
    readonly cancelada: FieldRef<"Pedido", 'Boolean'>
    readonly faturado: FieldRef<"Pedido", 'Boolean'>
    readonly codigoPedido: FieldRef<"Pedido", 'String'>
    readonly codigoProduto: FieldRef<"Pedido", 'String'>
    readonly setor: FieldRef<"Pedido", 'String'>
    readonly produto: FieldRef<"Pedido", 'String'>
    readonly precoUnitario: FieldRef<"Pedido", 'Decimal'>
    readonly quantidade: FieldRef<"Pedido", 'Decimal'>
    readonly valorTotal: FieldRef<"Pedido", 'Decimal'>
    readonly cliente: FieldRef<"Pedido", 'String'>
    readonly vendedor: FieldRef<"Pedido", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Pedido findUnique
   */
  export type PedidoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pedido
     */
    select?: PedidoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pedido
     */
    omit?: PedidoOmit<ExtArgs> | null
    /**
     * Filter, which Pedido to fetch.
     */
    where: PedidoWhereUniqueInput
  }

  /**
   * Pedido findUniqueOrThrow
   */
  export type PedidoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pedido
     */
    select?: PedidoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pedido
     */
    omit?: PedidoOmit<ExtArgs> | null
    /**
     * Filter, which Pedido to fetch.
     */
    where: PedidoWhereUniqueInput
  }

  /**
   * Pedido findFirst
   */
  export type PedidoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pedido
     */
    select?: PedidoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pedido
     */
    omit?: PedidoOmit<ExtArgs> | null
    /**
     * Filter, which Pedido to fetch.
     */
    where?: PedidoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pedidos to fetch.
     */
    orderBy?: PedidoOrderByWithRelationInput | PedidoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Pedidos.
     */
    cursor?: PedidoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pedidos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pedidos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Pedidos.
     */
    distinct?: PedidoScalarFieldEnum | PedidoScalarFieldEnum[]
  }

  /**
   * Pedido findFirstOrThrow
   */
  export type PedidoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pedido
     */
    select?: PedidoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pedido
     */
    omit?: PedidoOmit<ExtArgs> | null
    /**
     * Filter, which Pedido to fetch.
     */
    where?: PedidoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pedidos to fetch.
     */
    orderBy?: PedidoOrderByWithRelationInput | PedidoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Pedidos.
     */
    cursor?: PedidoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pedidos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pedidos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Pedidos.
     */
    distinct?: PedidoScalarFieldEnum | PedidoScalarFieldEnum[]
  }

  /**
   * Pedido findMany
   */
  export type PedidoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pedido
     */
    select?: PedidoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pedido
     */
    omit?: PedidoOmit<ExtArgs> | null
    /**
     * Filter, which Pedidos to fetch.
     */
    where?: PedidoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pedidos to fetch.
     */
    orderBy?: PedidoOrderByWithRelationInput | PedidoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Pedidos.
     */
    cursor?: PedidoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pedidos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pedidos.
     */
    skip?: number
    distinct?: PedidoScalarFieldEnum | PedidoScalarFieldEnum[]
  }

  /**
   * Pedido create
   */
  export type PedidoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pedido
     */
    select?: PedidoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pedido
     */
    omit?: PedidoOmit<ExtArgs> | null
    /**
     * The data needed to create a Pedido.
     */
    data: XOR<PedidoCreateInput, PedidoUncheckedCreateInput>
  }

  /**
   * Pedido createMany
   */
  export type PedidoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Pedidos.
     */
    data: PedidoCreateManyInput | PedidoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Pedido createManyAndReturn
   */
  export type PedidoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pedido
     */
    select?: PedidoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Pedido
     */
    omit?: PedidoOmit<ExtArgs> | null
    /**
     * The data used to create many Pedidos.
     */
    data: PedidoCreateManyInput | PedidoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Pedido update
   */
  export type PedidoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pedido
     */
    select?: PedidoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pedido
     */
    omit?: PedidoOmit<ExtArgs> | null
    /**
     * The data needed to update a Pedido.
     */
    data: XOR<PedidoUpdateInput, PedidoUncheckedUpdateInput>
    /**
     * Choose, which Pedido to update.
     */
    where: PedidoWhereUniqueInput
  }

  /**
   * Pedido updateMany
   */
  export type PedidoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Pedidos.
     */
    data: XOR<PedidoUpdateManyMutationInput, PedidoUncheckedUpdateManyInput>
    /**
     * Filter which Pedidos to update
     */
    where?: PedidoWhereInput
    /**
     * Limit how many Pedidos to update.
     */
    limit?: number
  }

  /**
   * Pedido updateManyAndReturn
   */
  export type PedidoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pedido
     */
    select?: PedidoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Pedido
     */
    omit?: PedidoOmit<ExtArgs> | null
    /**
     * The data used to update Pedidos.
     */
    data: XOR<PedidoUpdateManyMutationInput, PedidoUncheckedUpdateManyInput>
    /**
     * Filter which Pedidos to update
     */
    where?: PedidoWhereInput
    /**
     * Limit how many Pedidos to update.
     */
    limit?: number
  }

  /**
   * Pedido upsert
   */
  export type PedidoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pedido
     */
    select?: PedidoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pedido
     */
    omit?: PedidoOmit<ExtArgs> | null
    /**
     * The filter to search for the Pedido to update in case it exists.
     */
    where: PedidoWhereUniqueInput
    /**
     * In case the Pedido found by the `where` argument doesn't exist, create a new Pedido with this data.
     */
    create: XOR<PedidoCreateInput, PedidoUncheckedCreateInput>
    /**
     * In case the Pedido was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PedidoUpdateInput, PedidoUncheckedUpdateInput>
  }

  /**
   * Pedido delete
   */
  export type PedidoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pedido
     */
    select?: PedidoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pedido
     */
    omit?: PedidoOmit<ExtArgs> | null
    /**
     * Filter which Pedido to delete.
     */
    where: PedidoWhereUniqueInput
  }

  /**
   * Pedido deleteMany
   */
  export type PedidoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Pedidos to delete
     */
    where?: PedidoWhereInput
    /**
     * Limit how many Pedidos to delete.
     */
    limit?: number
  }

  /**
   * Pedido without action
   */
  export type PedidoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pedido
     */
    select?: PedidoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pedido
     */
    omit?: PedidoOmit<ExtArgs> | null
  }


  /**
   * Model DashboardMarketing
   */

  export type AggregateDashboardMarketing = {
    _count: DashboardMarketingCountAggregateOutputType | null
    _avg: DashboardMarketingAvgAggregateOutputType | null
    _sum: DashboardMarketingSumAggregateOutputType | null
    _min: DashboardMarketingMinAggregateOutputType | null
    _max: DashboardMarketingMaxAggregateOutputType | null
  }

  export type DashboardMarketingAvgAggregateOutputType = {
    sessoes: number | null
    usuarios: number | null
    taxaRejeicao: number | null
    taxaConversaoSite: number | null
    taxaAbandonoCarrinho: number | null
    impressoes: number | null
    cliques: number | null
    ctr: number | null
    cpc: Decimal | null
    conversoes: number | null
    custoPorConversao: Decimal | null
    roas: number | null
    custoPorLead: Decimal | null
    faturamentoTotal: Decimal | null
  }

  export type DashboardMarketingSumAggregateOutputType = {
    sessoes: number | null
    usuarios: number | null
    taxaRejeicao: number | null
    taxaConversaoSite: number | null
    taxaAbandonoCarrinho: number | null
    impressoes: number | null
    cliques: number | null
    ctr: number | null
    cpc: Decimal | null
    conversoes: number | null
    custoPorConversao: Decimal | null
    roas: number | null
    custoPorLead: Decimal | null
    faturamentoTotal: Decimal | null
  }

  export type DashboardMarketingMinAggregateOutputType = {
    id: string | null
    organizationId: string | null
    sessoes: number | null
    usuarios: number | null
    taxaRejeicao: number | null
    taxaConversaoSite: number | null
    taxaAbandonoCarrinho: number | null
    impressoes: number | null
    cliques: number | null
    ctr: number | null
    cpc: Decimal | null
    conversoes: number | null
    custoPorConversao: Decimal | null
    roas: number | null
    custoPorLead: Decimal | null
    faturamentoTotal: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DashboardMarketingMaxAggregateOutputType = {
    id: string | null
    organizationId: string | null
    sessoes: number | null
    usuarios: number | null
    taxaRejeicao: number | null
    taxaConversaoSite: number | null
    taxaAbandonoCarrinho: number | null
    impressoes: number | null
    cliques: number | null
    ctr: number | null
    cpc: Decimal | null
    conversoes: number | null
    custoPorConversao: Decimal | null
    roas: number | null
    custoPorLead: Decimal | null
    faturamentoTotal: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DashboardMarketingCountAggregateOutputType = {
    id: number
    organizationId: number
    sessoes: number
    usuarios: number
    taxaRejeicao: number
    taxaConversaoSite: number
    taxaAbandonoCarrinho: number
    impressoes: number
    cliques: number
    ctr: number
    cpc: number
    conversoes: number
    custoPorConversao: number
    roas: number
    custoPorLead: number
    faturamentoTotal: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DashboardMarketingAvgAggregateInputType = {
    sessoes?: true
    usuarios?: true
    taxaRejeicao?: true
    taxaConversaoSite?: true
    taxaAbandonoCarrinho?: true
    impressoes?: true
    cliques?: true
    ctr?: true
    cpc?: true
    conversoes?: true
    custoPorConversao?: true
    roas?: true
    custoPorLead?: true
    faturamentoTotal?: true
  }

  export type DashboardMarketingSumAggregateInputType = {
    sessoes?: true
    usuarios?: true
    taxaRejeicao?: true
    taxaConversaoSite?: true
    taxaAbandonoCarrinho?: true
    impressoes?: true
    cliques?: true
    ctr?: true
    cpc?: true
    conversoes?: true
    custoPorConversao?: true
    roas?: true
    custoPorLead?: true
    faturamentoTotal?: true
  }

  export type DashboardMarketingMinAggregateInputType = {
    id?: true
    organizationId?: true
    sessoes?: true
    usuarios?: true
    taxaRejeicao?: true
    taxaConversaoSite?: true
    taxaAbandonoCarrinho?: true
    impressoes?: true
    cliques?: true
    ctr?: true
    cpc?: true
    conversoes?: true
    custoPorConversao?: true
    roas?: true
    custoPorLead?: true
    faturamentoTotal?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DashboardMarketingMaxAggregateInputType = {
    id?: true
    organizationId?: true
    sessoes?: true
    usuarios?: true
    taxaRejeicao?: true
    taxaConversaoSite?: true
    taxaAbandonoCarrinho?: true
    impressoes?: true
    cliques?: true
    ctr?: true
    cpc?: true
    conversoes?: true
    custoPorConversao?: true
    roas?: true
    custoPorLead?: true
    faturamentoTotal?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DashboardMarketingCountAggregateInputType = {
    id?: true
    organizationId?: true
    sessoes?: true
    usuarios?: true
    taxaRejeicao?: true
    taxaConversaoSite?: true
    taxaAbandonoCarrinho?: true
    impressoes?: true
    cliques?: true
    ctr?: true
    cpc?: true
    conversoes?: true
    custoPorConversao?: true
    roas?: true
    custoPorLead?: true
    faturamentoTotal?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DashboardMarketingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DashboardMarketing to aggregate.
     */
    where?: DashboardMarketingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DashboardMarketings to fetch.
     */
    orderBy?: DashboardMarketingOrderByWithRelationInput | DashboardMarketingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DashboardMarketingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DashboardMarketings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DashboardMarketings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DashboardMarketings
    **/
    _count?: true | DashboardMarketingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DashboardMarketingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DashboardMarketingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DashboardMarketingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DashboardMarketingMaxAggregateInputType
  }

  export type GetDashboardMarketingAggregateType<T extends DashboardMarketingAggregateArgs> = {
        [P in keyof T & keyof AggregateDashboardMarketing]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDashboardMarketing[P]>
      : GetScalarType<T[P], AggregateDashboardMarketing[P]>
  }




  export type DashboardMarketingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DashboardMarketingWhereInput
    orderBy?: DashboardMarketingOrderByWithAggregationInput | DashboardMarketingOrderByWithAggregationInput[]
    by: DashboardMarketingScalarFieldEnum[] | DashboardMarketingScalarFieldEnum
    having?: DashboardMarketingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DashboardMarketingCountAggregateInputType | true
    _avg?: DashboardMarketingAvgAggregateInputType
    _sum?: DashboardMarketingSumAggregateInputType
    _min?: DashboardMarketingMinAggregateInputType
    _max?: DashboardMarketingMaxAggregateInputType
  }

  export type DashboardMarketingGroupByOutputType = {
    id: string
    organizationId: string
    sessoes: number
    usuarios: number
    taxaRejeicao: number
    taxaConversaoSite: number
    taxaAbandonoCarrinho: number
    impressoes: number
    cliques: number
    ctr: number
    cpc: Decimal
    conversoes: number
    custoPorConversao: Decimal
    roas: number
    custoPorLead: Decimal
    faturamentoTotal: Decimal
    createdAt: Date
    updatedAt: Date
    _count: DashboardMarketingCountAggregateOutputType | null
    _avg: DashboardMarketingAvgAggregateOutputType | null
    _sum: DashboardMarketingSumAggregateOutputType | null
    _min: DashboardMarketingMinAggregateOutputType | null
    _max: DashboardMarketingMaxAggregateOutputType | null
  }

  type GetDashboardMarketingGroupByPayload<T extends DashboardMarketingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DashboardMarketingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DashboardMarketingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DashboardMarketingGroupByOutputType[P]>
            : GetScalarType<T[P], DashboardMarketingGroupByOutputType[P]>
        }
      >
    >


  export type DashboardMarketingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    sessoes?: boolean
    usuarios?: boolean
    taxaRejeicao?: boolean
    taxaConversaoSite?: boolean
    taxaAbandonoCarrinho?: boolean
    impressoes?: boolean
    cliques?: boolean
    ctr?: boolean
    cpc?: boolean
    conversoes?: boolean
    custoPorConversao?: boolean
    roas?: boolean
    custoPorLead?: boolean
    faturamentoTotal?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    anunciosCTR?: boolean | DashboardMarketing$anunciosCTRArgs<ExtArgs>
    anunciosConv?: boolean | DashboardMarketing$anunciosConvArgs<ExtArgs>
    canais?: boolean | DashboardMarketing$canaisArgs<ExtArgs>
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    palavrasChave?: boolean | DashboardMarketing$palavrasChaveArgs<ExtArgs>
    trafego?: boolean | DashboardMarketing$trafegoArgs<ExtArgs>
    _count?: boolean | DashboardMarketingCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dashboardMarketing"]>

  export type DashboardMarketingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    sessoes?: boolean
    usuarios?: boolean
    taxaRejeicao?: boolean
    taxaConversaoSite?: boolean
    taxaAbandonoCarrinho?: boolean
    impressoes?: boolean
    cliques?: boolean
    ctr?: boolean
    cpc?: boolean
    conversoes?: boolean
    custoPorConversao?: boolean
    roas?: boolean
    custoPorLead?: boolean
    faturamentoTotal?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dashboardMarketing"]>

  export type DashboardMarketingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    sessoes?: boolean
    usuarios?: boolean
    taxaRejeicao?: boolean
    taxaConversaoSite?: boolean
    taxaAbandonoCarrinho?: boolean
    impressoes?: boolean
    cliques?: boolean
    ctr?: boolean
    cpc?: boolean
    conversoes?: boolean
    custoPorConversao?: boolean
    roas?: boolean
    custoPorLead?: boolean
    faturamentoTotal?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dashboardMarketing"]>

  export type DashboardMarketingSelectScalar = {
    id?: boolean
    organizationId?: boolean
    sessoes?: boolean
    usuarios?: boolean
    taxaRejeicao?: boolean
    taxaConversaoSite?: boolean
    taxaAbandonoCarrinho?: boolean
    impressoes?: boolean
    cliques?: boolean
    ctr?: boolean
    cpc?: boolean
    conversoes?: boolean
    custoPorConversao?: boolean
    roas?: boolean
    custoPorLead?: boolean
    faturamentoTotal?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DashboardMarketingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "organizationId" | "sessoes" | "usuarios" | "taxaRejeicao" | "taxaConversaoSite" | "taxaAbandonoCarrinho" | "impressoes" | "cliques" | "ctr" | "cpc" | "conversoes" | "custoPorConversao" | "roas" | "custoPorLead" | "faturamentoTotal" | "createdAt" | "updatedAt", ExtArgs["result"]["dashboardMarketing"]>
  export type DashboardMarketingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    anunciosCTR?: boolean | DashboardMarketing$anunciosCTRArgs<ExtArgs>
    anunciosConv?: boolean | DashboardMarketing$anunciosConvArgs<ExtArgs>
    canais?: boolean | DashboardMarketing$canaisArgs<ExtArgs>
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    palavrasChave?: boolean | DashboardMarketing$palavrasChaveArgs<ExtArgs>
    trafego?: boolean | DashboardMarketing$trafegoArgs<ExtArgs>
    _count?: boolean | DashboardMarketingCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DashboardMarketingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }
  export type DashboardMarketingIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }

  export type $DashboardMarketingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DashboardMarketing"
    objects: {
      anunciosCTR: Prisma.$AnuncioCTRPayload<ExtArgs>[]
      anunciosConv: Prisma.$AnuncioConversaoPayload<ExtArgs>[]
      canais: Prisma.$CanalTrafegoPayload<ExtArgs>[]
      organization: Prisma.$OrganizationPayload<ExtArgs>
      palavrasChave: Prisma.$PalavraChavePayload<ExtArgs>[]
      trafego: Prisma.$TrafegoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      organizationId: string
      sessoes: number
      usuarios: number
      taxaRejeicao: number
      taxaConversaoSite: number
      taxaAbandonoCarrinho: number
      impressoes: number
      cliques: number
      ctr: number
      cpc: Prisma.Decimal
      conversoes: number
      custoPorConversao: Prisma.Decimal
      roas: number
      custoPorLead: Prisma.Decimal
      faturamentoTotal: Prisma.Decimal
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["dashboardMarketing"]>
    composites: {}
  }

  type DashboardMarketingGetPayload<S extends boolean | null | undefined | DashboardMarketingDefaultArgs> = $Result.GetResult<Prisma.$DashboardMarketingPayload, S>

  type DashboardMarketingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DashboardMarketingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DashboardMarketingCountAggregateInputType | true
    }

  export interface DashboardMarketingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DashboardMarketing'], meta: { name: 'DashboardMarketing' } }
    /**
     * Find zero or one DashboardMarketing that matches the filter.
     * @param {DashboardMarketingFindUniqueArgs} args - Arguments to find a DashboardMarketing
     * @example
     * // Get one DashboardMarketing
     * const dashboardMarketing = await prisma.dashboardMarketing.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DashboardMarketingFindUniqueArgs>(args: SelectSubset<T, DashboardMarketingFindUniqueArgs<ExtArgs>>): Prisma__DashboardMarketingClient<$Result.GetResult<Prisma.$DashboardMarketingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DashboardMarketing that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DashboardMarketingFindUniqueOrThrowArgs} args - Arguments to find a DashboardMarketing
     * @example
     * // Get one DashboardMarketing
     * const dashboardMarketing = await prisma.dashboardMarketing.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DashboardMarketingFindUniqueOrThrowArgs>(args: SelectSubset<T, DashboardMarketingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DashboardMarketingClient<$Result.GetResult<Prisma.$DashboardMarketingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DashboardMarketing that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DashboardMarketingFindFirstArgs} args - Arguments to find a DashboardMarketing
     * @example
     * // Get one DashboardMarketing
     * const dashboardMarketing = await prisma.dashboardMarketing.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DashboardMarketingFindFirstArgs>(args?: SelectSubset<T, DashboardMarketingFindFirstArgs<ExtArgs>>): Prisma__DashboardMarketingClient<$Result.GetResult<Prisma.$DashboardMarketingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DashboardMarketing that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DashboardMarketingFindFirstOrThrowArgs} args - Arguments to find a DashboardMarketing
     * @example
     * // Get one DashboardMarketing
     * const dashboardMarketing = await prisma.dashboardMarketing.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DashboardMarketingFindFirstOrThrowArgs>(args?: SelectSubset<T, DashboardMarketingFindFirstOrThrowArgs<ExtArgs>>): Prisma__DashboardMarketingClient<$Result.GetResult<Prisma.$DashboardMarketingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DashboardMarketings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DashboardMarketingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DashboardMarketings
     * const dashboardMarketings = await prisma.dashboardMarketing.findMany()
     * 
     * // Get first 10 DashboardMarketings
     * const dashboardMarketings = await prisma.dashboardMarketing.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dashboardMarketingWithIdOnly = await prisma.dashboardMarketing.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DashboardMarketingFindManyArgs>(args?: SelectSubset<T, DashboardMarketingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DashboardMarketingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DashboardMarketing.
     * @param {DashboardMarketingCreateArgs} args - Arguments to create a DashboardMarketing.
     * @example
     * // Create one DashboardMarketing
     * const DashboardMarketing = await prisma.dashboardMarketing.create({
     *   data: {
     *     // ... data to create a DashboardMarketing
     *   }
     * })
     * 
     */
    create<T extends DashboardMarketingCreateArgs>(args: SelectSubset<T, DashboardMarketingCreateArgs<ExtArgs>>): Prisma__DashboardMarketingClient<$Result.GetResult<Prisma.$DashboardMarketingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DashboardMarketings.
     * @param {DashboardMarketingCreateManyArgs} args - Arguments to create many DashboardMarketings.
     * @example
     * // Create many DashboardMarketings
     * const dashboardMarketing = await prisma.dashboardMarketing.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DashboardMarketingCreateManyArgs>(args?: SelectSubset<T, DashboardMarketingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DashboardMarketings and returns the data saved in the database.
     * @param {DashboardMarketingCreateManyAndReturnArgs} args - Arguments to create many DashboardMarketings.
     * @example
     * // Create many DashboardMarketings
     * const dashboardMarketing = await prisma.dashboardMarketing.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DashboardMarketings and only return the `id`
     * const dashboardMarketingWithIdOnly = await prisma.dashboardMarketing.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DashboardMarketingCreateManyAndReturnArgs>(args?: SelectSubset<T, DashboardMarketingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DashboardMarketingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DashboardMarketing.
     * @param {DashboardMarketingDeleteArgs} args - Arguments to delete one DashboardMarketing.
     * @example
     * // Delete one DashboardMarketing
     * const DashboardMarketing = await prisma.dashboardMarketing.delete({
     *   where: {
     *     // ... filter to delete one DashboardMarketing
     *   }
     * })
     * 
     */
    delete<T extends DashboardMarketingDeleteArgs>(args: SelectSubset<T, DashboardMarketingDeleteArgs<ExtArgs>>): Prisma__DashboardMarketingClient<$Result.GetResult<Prisma.$DashboardMarketingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DashboardMarketing.
     * @param {DashboardMarketingUpdateArgs} args - Arguments to update one DashboardMarketing.
     * @example
     * // Update one DashboardMarketing
     * const dashboardMarketing = await prisma.dashboardMarketing.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DashboardMarketingUpdateArgs>(args: SelectSubset<T, DashboardMarketingUpdateArgs<ExtArgs>>): Prisma__DashboardMarketingClient<$Result.GetResult<Prisma.$DashboardMarketingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DashboardMarketings.
     * @param {DashboardMarketingDeleteManyArgs} args - Arguments to filter DashboardMarketings to delete.
     * @example
     * // Delete a few DashboardMarketings
     * const { count } = await prisma.dashboardMarketing.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DashboardMarketingDeleteManyArgs>(args?: SelectSubset<T, DashboardMarketingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DashboardMarketings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DashboardMarketingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DashboardMarketings
     * const dashboardMarketing = await prisma.dashboardMarketing.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DashboardMarketingUpdateManyArgs>(args: SelectSubset<T, DashboardMarketingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DashboardMarketings and returns the data updated in the database.
     * @param {DashboardMarketingUpdateManyAndReturnArgs} args - Arguments to update many DashboardMarketings.
     * @example
     * // Update many DashboardMarketings
     * const dashboardMarketing = await prisma.dashboardMarketing.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DashboardMarketings and only return the `id`
     * const dashboardMarketingWithIdOnly = await prisma.dashboardMarketing.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DashboardMarketingUpdateManyAndReturnArgs>(args: SelectSubset<T, DashboardMarketingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DashboardMarketingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DashboardMarketing.
     * @param {DashboardMarketingUpsertArgs} args - Arguments to update or create a DashboardMarketing.
     * @example
     * // Update or create a DashboardMarketing
     * const dashboardMarketing = await prisma.dashboardMarketing.upsert({
     *   create: {
     *     // ... data to create a DashboardMarketing
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DashboardMarketing we want to update
     *   }
     * })
     */
    upsert<T extends DashboardMarketingUpsertArgs>(args: SelectSubset<T, DashboardMarketingUpsertArgs<ExtArgs>>): Prisma__DashboardMarketingClient<$Result.GetResult<Prisma.$DashboardMarketingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DashboardMarketings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DashboardMarketingCountArgs} args - Arguments to filter DashboardMarketings to count.
     * @example
     * // Count the number of DashboardMarketings
     * const count = await prisma.dashboardMarketing.count({
     *   where: {
     *     // ... the filter for the DashboardMarketings we want to count
     *   }
     * })
    **/
    count<T extends DashboardMarketingCountArgs>(
      args?: Subset<T, DashboardMarketingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DashboardMarketingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DashboardMarketing.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DashboardMarketingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DashboardMarketingAggregateArgs>(args: Subset<T, DashboardMarketingAggregateArgs>): Prisma.PrismaPromise<GetDashboardMarketingAggregateType<T>>

    /**
     * Group by DashboardMarketing.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DashboardMarketingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DashboardMarketingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DashboardMarketingGroupByArgs['orderBy'] }
        : { orderBy?: DashboardMarketingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DashboardMarketingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDashboardMarketingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DashboardMarketing model
   */
  readonly fields: DashboardMarketingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DashboardMarketing.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DashboardMarketingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    anunciosCTR<T extends DashboardMarketing$anunciosCTRArgs<ExtArgs> = {}>(args?: Subset<T, DashboardMarketing$anunciosCTRArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnuncioCTRPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    anunciosConv<T extends DashboardMarketing$anunciosConvArgs<ExtArgs> = {}>(args?: Subset<T, DashboardMarketing$anunciosConvArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnuncioConversaoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    canais<T extends DashboardMarketing$canaisArgs<ExtArgs> = {}>(args?: Subset<T, DashboardMarketing$canaisArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CanalTrafegoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    organization<T extends OrganizationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrganizationDefaultArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    palavrasChave<T extends DashboardMarketing$palavrasChaveArgs<ExtArgs> = {}>(args?: Subset<T, DashboardMarketing$palavrasChaveArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PalavraChavePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    trafego<T extends DashboardMarketing$trafegoArgs<ExtArgs> = {}>(args?: Subset<T, DashboardMarketing$trafegoArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrafegoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DashboardMarketing model
   */
  interface DashboardMarketingFieldRefs {
    readonly id: FieldRef<"DashboardMarketing", 'String'>
    readonly organizationId: FieldRef<"DashboardMarketing", 'String'>
    readonly sessoes: FieldRef<"DashboardMarketing", 'Int'>
    readonly usuarios: FieldRef<"DashboardMarketing", 'Int'>
    readonly taxaRejeicao: FieldRef<"DashboardMarketing", 'Float'>
    readonly taxaConversaoSite: FieldRef<"DashboardMarketing", 'Float'>
    readonly taxaAbandonoCarrinho: FieldRef<"DashboardMarketing", 'Float'>
    readonly impressoes: FieldRef<"DashboardMarketing", 'Int'>
    readonly cliques: FieldRef<"DashboardMarketing", 'Int'>
    readonly ctr: FieldRef<"DashboardMarketing", 'Float'>
    readonly cpc: FieldRef<"DashboardMarketing", 'Decimal'>
    readonly conversoes: FieldRef<"DashboardMarketing", 'Int'>
    readonly custoPorConversao: FieldRef<"DashboardMarketing", 'Decimal'>
    readonly roas: FieldRef<"DashboardMarketing", 'Float'>
    readonly custoPorLead: FieldRef<"DashboardMarketing", 'Decimal'>
    readonly faturamentoTotal: FieldRef<"DashboardMarketing", 'Decimal'>
    readonly createdAt: FieldRef<"DashboardMarketing", 'DateTime'>
    readonly updatedAt: FieldRef<"DashboardMarketing", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DashboardMarketing findUnique
   */
  export type DashboardMarketingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardMarketing
     */
    select?: DashboardMarketingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DashboardMarketing
     */
    omit?: DashboardMarketingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DashboardMarketingInclude<ExtArgs> | null
    /**
     * Filter, which DashboardMarketing to fetch.
     */
    where: DashboardMarketingWhereUniqueInput
  }

  /**
   * DashboardMarketing findUniqueOrThrow
   */
  export type DashboardMarketingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardMarketing
     */
    select?: DashboardMarketingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DashboardMarketing
     */
    omit?: DashboardMarketingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DashboardMarketingInclude<ExtArgs> | null
    /**
     * Filter, which DashboardMarketing to fetch.
     */
    where: DashboardMarketingWhereUniqueInput
  }

  /**
   * DashboardMarketing findFirst
   */
  export type DashboardMarketingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardMarketing
     */
    select?: DashboardMarketingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DashboardMarketing
     */
    omit?: DashboardMarketingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DashboardMarketingInclude<ExtArgs> | null
    /**
     * Filter, which DashboardMarketing to fetch.
     */
    where?: DashboardMarketingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DashboardMarketings to fetch.
     */
    orderBy?: DashboardMarketingOrderByWithRelationInput | DashboardMarketingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DashboardMarketings.
     */
    cursor?: DashboardMarketingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DashboardMarketings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DashboardMarketings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DashboardMarketings.
     */
    distinct?: DashboardMarketingScalarFieldEnum | DashboardMarketingScalarFieldEnum[]
  }

  /**
   * DashboardMarketing findFirstOrThrow
   */
  export type DashboardMarketingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardMarketing
     */
    select?: DashboardMarketingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DashboardMarketing
     */
    omit?: DashboardMarketingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DashboardMarketingInclude<ExtArgs> | null
    /**
     * Filter, which DashboardMarketing to fetch.
     */
    where?: DashboardMarketingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DashboardMarketings to fetch.
     */
    orderBy?: DashboardMarketingOrderByWithRelationInput | DashboardMarketingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DashboardMarketings.
     */
    cursor?: DashboardMarketingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DashboardMarketings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DashboardMarketings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DashboardMarketings.
     */
    distinct?: DashboardMarketingScalarFieldEnum | DashboardMarketingScalarFieldEnum[]
  }

  /**
   * DashboardMarketing findMany
   */
  export type DashboardMarketingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardMarketing
     */
    select?: DashboardMarketingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DashboardMarketing
     */
    omit?: DashboardMarketingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DashboardMarketingInclude<ExtArgs> | null
    /**
     * Filter, which DashboardMarketings to fetch.
     */
    where?: DashboardMarketingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DashboardMarketings to fetch.
     */
    orderBy?: DashboardMarketingOrderByWithRelationInput | DashboardMarketingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DashboardMarketings.
     */
    cursor?: DashboardMarketingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DashboardMarketings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DashboardMarketings.
     */
    skip?: number
    distinct?: DashboardMarketingScalarFieldEnum | DashboardMarketingScalarFieldEnum[]
  }

  /**
   * DashboardMarketing create
   */
  export type DashboardMarketingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardMarketing
     */
    select?: DashboardMarketingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DashboardMarketing
     */
    omit?: DashboardMarketingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DashboardMarketingInclude<ExtArgs> | null
    /**
     * The data needed to create a DashboardMarketing.
     */
    data: XOR<DashboardMarketingCreateInput, DashboardMarketingUncheckedCreateInput>
  }

  /**
   * DashboardMarketing createMany
   */
  export type DashboardMarketingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DashboardMarketings.
     */
    data: DashboardMarketingCreateManyInput | DashboardMarketingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DashboardMarketing createManyAndReturn
   */
  export type DashboardMarketingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardMarketing
     */
    select?: DashboardMarketingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DashboardMarketing
     */
    omit?: DashboardMarketingOmit<ExtArgs> | null
    /**
     * The data used to create many DashboardMarketings.
     */
    data: DashboardMarketingCreateManyInput | DashboardMarketingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DashboardMarketingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DashboardMarketing update
   */
  export type DashboardMarketingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardMarketing
     */
    select?: DashboardMarketingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DashboardMarketing
     */
    omit?: DashboardMarketingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DashboardMarketingInclude<ExtArgs> | null
    /**
     * The data needed to update a DashboardMarketing.
     */
    data: XOR<DashboardMarketingUpdateInput, DashboardMarketingUncheckedUpdateInput>
    /**
     * Choose, which DashboardMarketing to update.
     */
    where: DashboardMarketingWhereUniqueInput
  }

  /**
   * DashboardMarketing updateMany
   */
  export type DashboardMarketingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DashboardMarketings.
     */
    data: XOR<DashboardMarketingUpdateManyMutationInput, DashboardMarketingUncheckedUpdateManyInput>
    /**
     * Filter which DashboardMarketings to update
     */
    where?: DashboardMarketingWhereInput
    /**
     * Limit how many DashboardMarketings to update.
     */
    limit?: number
  }

  /**
   * DashboardMarketing updateManyAndReturn
   */
  export type DashboardMarketingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardMarketing
     */
    select?: DashboardMarketingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DashboardMarketing
     */
    omit?: DashboardMarketingOmit<ExtArgs> | null
    /**
     * The data used to update DashboardMarketings.
     */
    data: XOR<DashboardMarketingUpdateManyMutationInput, DashboardMarketingUncheckedUpdateManyInput>
    /**
     * Filter which DashboardMarketings to update
     */
    where?: DashboardMarketingWhereInput
    /**
     * Limit how many DashboardMarketings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DashboardMarketingIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DashboardMarketing upsert
   */
  export type DashboardMarketingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardMarketing
     */
    select?: DashboardMarketingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DashboardMarketing
     */
    omit?: DashboardMarketingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DashboardMarketingInclude<ExtArgs> | null
    /**
     * The filter to search for the DashboardMarketing to update in case it exists.
     */
    where: DashboardMarketingWhereUniqueInput
    /**
     * In case the DashboardMarketing found by the `where` argument doesn't exist, create a new DashboardMarketing with this data.
     */
    create: XOR<DashboardMarketingCreateInput, DashboardMarketingUncheckedCreateInput>
    /**
     * In case the DashboardMarketing was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DashboardMarketingUpdateInput, DashboardMarketingUncheckedUpdateInput>
  }

  /**
   * DashboardMarketing delete
   */
  export type DashboardMarketingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardMarketing
     */
    select?: DashboardMarketingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DashboardMarketing
     */
    omit?: DashboardMarketingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DashboardMarketingInclude<ExtArgs> | null
    /**
     * Filter which DashboardMarketing to delete.
     */
    where: DashboardMarketingWhereUniqueInput
  }

  /**
   * DashboardMarketing deleteMany
   */
  export type DashboardMarketingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DashboardMarketings to delete
     */
    where?: DashboardMarketingWhereInput
    /**
     * Limit how many DashboardMarketings to delete.
     */
    limit?: number
  }

  /**
   * DashboardMarketing.anunciosCTR
   */
  export type DashboardMarketing$anunciosCTRArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnuncioCTR
     */
    select?: AnuncioCTRSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnuncioCTR
     */
    omit?: AnuncioCTROmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnuncioCTRInclude<ExtArgs> | null
    where?: AnuncioCTRWhereInput
    orderBy?: AnuncioCTROrderByWithRelationInput | AnuncioCTROrderByWithRelationInput[]
    cursor?: AnuncioCTRWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AnuncioCTRScalarFieldEnum | AnuncioCTRScalarFieldEnum[]
  }

  /**
   * DashboardMarketing.anunciosConv
   */
  export type DashboardMarketing$anunciosConvArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnuncioConversao
     */
    select?: AnuncioConversaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnuncioConversao
     */
    omit?: AnuncioConversaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnuncioConversaoInclude<ExtArgs> | null
    where?: AnuncioConversaoWhereInput
    orderBy?: AnuncioConversaoOrderByWithRelationInput | AnuncioConversaoOrderByWithRelationInput[]
    cursor?: AnuncioConversaoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AnuncioConversaoScalarFieldEnum | AnuncioConversaoScalarFieldEnum[]
  }

  /**
   * DashboardMarketing.canais
   */
  export type DashboardMarketing$canaisArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanalTrafego
     */
    select?: CanalTrafegoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CanalTrafego
     */
    omit?: CanalTrafegoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanalTrafegoInclude<ExtArgs> | null
    where?: CanalTrafegoWhereInput
    orderBy?: CanalTrafegoOrderByWithRelationInput | CanalTrafegoOrderByWithRelationInput[]
    cursor?: CanalTrafegoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CanalTrafegoScalarFieldEnum | CanalTrafegoScalarFieldEnum[]
  }

  /**
   * DashboardMarketing.palavrasChave
   */
  export type DashboardMarketing$palavrasChaveArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PalavraChave
     */
    select?: PalavraChaveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PalavraChave
     */
    omit?: PalavraChaveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PalavraChaveInclude<ExtArgs> | null
    where?: PalavraChaveWhereInput
    orderBy?: PalavraChaveOrderByWithRelationInput | PalavraChaveOrderByWithRelationInput[]
    cursor?: PalavraChaveWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PalavraChaveScalarFieldEnum | PalavraChaveScalarFieldEnum[]
  }

  /**
   * DashboardMarketing.trafego
   */
  export type DashboardMarketing$trafegoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trafego
     */
    select?: TrafegoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trafego
     */
    omit?: TrafegoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrafegoInclude<ExtArgs> | null
    where?: TrafegoWhereInput
    orderBy?: TrafegoOrderByWithRelationInput | TrafegoOrderByWithRelationInput[]
    cursor?: TrafegoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TrafegoScalarFieldEnum | TrafegoScalarFieldEnum[]
  }

  /**
   * DashboardMarketing without action
   */
  export type DashboardMarketingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardMarketing
     */
    select?: DashboardMarketingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DashboardMarketing
     */
    omit?: DashboardMarketingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DashboardMarketingInclude<ExtArgs> | null
  }


  /**
   * Model Trafego
   */

  export type AggregateTrafego = {
    _count: TrafegoCountAggregateOutputType | null
    _avg: TrafegoAvgAggregateOutputType | null
    _sum: TrafegoSumAggregateOutputType | null
    _min: TrafegoMinAggregateOutputType | null
    _max: TrafegoMaxAggregateOutputType | null
  }

  export type TrafegoAvgAggregateOutputType = {
    valor: number | null
  }

  export type TrafegoSumAggregateOutputType = {
    valor: number | null
  }

  export type TrafegoMinAggregateOutputType = {
    id: string | null
    dashboardId: string | null
    origem: string | null
    valor: number | null
  }

  export type TrafegoMaxAggregateOutputType = {
    id: string | null
    dashboardId: string | null
    origem: string | null
    valor: number | null
  }

  export type TrafegoCountAggregateOutputType = {
    id: number
    dashboardId: number
    origem: number
    valor: number
    _all: number
  }


  export type TrafegoAvgAggregateInputType = {
    valor?: true
  }

  export type TrafegoSumAggregateInputType = {
    valor?: true
  }

  export type TrafegoMinAggregateInputType = {
    id?: true
    dashboardId?: true
    origem?: true
    valor?: true
  }

  export type TrafegoMaxAggregateInputType = {
    id?: true
    dashboardId?: true
    origem?: true
    valor?: true
  }

  export type TrafegoCountAggregateInputType = {
    id?: true
    dashboardId?: true
    origem?: true
    valor?: true
    _all?: true
  }

  export type TrafegoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Trafego to aggregate.
     */
    where?: TrafegoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Trafegos to fetch.
     */
    orderBy?: TrafegoOrderByWithRelationInput | TrafegoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TrafegoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Trafegos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Trafegos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Trafegos
    **/
    _count?: true | TrafegoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TrafegoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TrafegoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TrafegoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TrafegoMaxAggregateInputType
  }

  export type GetTrafegoAggregateType<T extends TrafegoAggregateArgs> = {
        [P in keyof T & keyof AggregateTrafego]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTrafego[P]>
      : GetScalarType<T[P], AggregateTrafego[P]>
  }




  export type TrafegoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrafegoWhereInput
    orderBy?: TrafegoOrderByWithAggregationInput | TrafegoOrderByWithAggregationInput[]
    by: TrafegoScalarFieldEnum[] | TrafegoScalarFieldEnum
    having?: TrafegoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TrafegoCountAggregateInputType | true
    _avg?: TrafegoAvgAggregateInputType
    _sum?: TrafegoSumAggregateInputType
    _min?: TrafegoMinAggregateInputType
    _max?: TrafegoMaxAggregateInputType
  }

  export type TrafegoGroupByOutputType = {
    id: string
    dashboardId: string
    origem: string
    valor: number
    _count: TrafegoCountAggregateOutputType | null
    _avg: TrafegoAvgAggregateOutputType | null
    _sum: TrafegoSumAggregateOutputType | null
    _min: TrafegoMinAggregateOutputType | null
    _max: TrafegoMaxAggregateOutputType | null
  }

  type GetTrafegoGroupByPayload<T extends TrafegoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TrafegoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TrafegoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TrafegoGroupByOutputType[P]>
            : GetScalarType<T[P], TrafegoGroupByOutputType[P]>
        }
      >
    >


  export type TrafegoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dashboardId?: boolean
    origem?: boolean
    valor?: boolean
    dashboard?: boolean | DashboardMarketingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trafego"]>

  export type TrafegoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dashboardId?: boolean
    origem?: boolean
    valor?: boolean
    dashboard?: boolean | DashboardMarketingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trafego"]>

  export type TrafegoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dashboardId?: boolean
    origem?: boolean
    valor?: boolean
    dashboard?: boolean | DashboardMarketingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trafego"]>

  export type TrafegoSelectScalar = {
    id?: boolean
    dashboardId?: boolean
    origem?: boolean
    valor?: boolean
  }

  export type TrafegoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "dashboardId" | "origem" | "valor", ExtArgs["result"]["trafego"]>
  export type TrafegoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dashboard?: boolean | DashboardMarketingDefaultArgs<ExtArgs>
  }
  export type TrafegoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dashboard?: boolean | DashboardMarketingDefaultArgs<ExtArgs>
  }
  export type TrafegoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dashboard?: boolean | DashboardMarketingDefaultArgs<ExtArgs>
  }

  export type $TrafegoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Trafego"
    objects: {
      dashboard: Prisma.$DashboardMarketingPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      dashboardId: string
      origem: string
      valor: number
    }, ExtArgs["result"]["trafego"]>
    composites: {}
  }

  type TrafegoGetPayload<S extends boolean | null | undefined | TrafegoDefaultArgs> = $Result.GetResult<Prisma.$TrafegoPayload, S>

  type TrafegoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TrafegoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TrafegoCountAggregateInputType | true
    }

  export interface TrafegoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Trafego'], meta: { name: 'Trafego' } }
    /**
     * Find zero or one Trafego that matches the filter.
     * @param {TrafegoFindUniqueArgs} args - Arguments to find a Trafego
     * @example
     * // Get one Trafego
     * const trafego = await prisma.trafego.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TrafegoFindUniqueArgs>(args: SelectSubset<T, TrafegoFindUniqueArgs<ExtArgs>>): Prisma__TrafegoClient<$Result.GetResult<Prisma.$TrafegoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Trafego that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TrafegoFindUniqueOrThrowArgs} args - Arguments to find a Trafego
     * @example
     * // Get one Trafego
     * const trafego = await prisma.trafego.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TrafegoFindUniqueOrThrowArgs>(args: SelectSubset<T, TrafegoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TrafegoClient<$Result.GetResult<Prisma.$TrafegoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Trafego that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrafegoFindFirstArgs} args - Arguments to find a Trafego
     * @example
     * // Get one Trafego
     * const trafego = await prisma.trafego.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TrafegoFindFirstArgs>(args?: SelectSubset<T, TrafegoFindFirstArgs<ExtArgs>>): Prisma__TrafegoClient<$Result.GetResult<Prisma.$TrafegoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Trafego that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrafegoFindFirstOrThrowArgs} args - Arguments to find a Trafego
     * @example
     * // Get one Trafego
     * const trafego = await prisma.trafego.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TrafegoFindFirstOrThrowArgs>(args?: SelectSubset<T, TrafegoFindFirstOrThrowArgs<ExtArgs>>): Prisma__TrafegoClient<$Result.GetResult<Prisma.$TrafegoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Trafegos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrafegoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Trafegos
     * const trafegos = await prisma.trafego.findMany()
     * 
     * // Get first 10 Trafegos
     * const trafegos = await prisma.trafego.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const trafegoWithIdOnly = await prisma.trafego.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TrafegoFindManyArgs>(args?: SelectSubset<T, TrafegoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrafegoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Trafego.
     * @param {TrafegoCreateArgs} args - Arguments to create a Trafego.
     * @example
     * // Create one Trafego
     * const Trafego = await prisma.trafego.create({
     *   data: {
     *     // ... data to create a Trafego
     *   }
     * })
     * 
     */
    create<T extends TrafegoCreateArgs>(args: SelectSubset<T, TrafegoCreateArgs<ExtArgs>>): Prisma__TrafegoClient<$Result.GetResult<Prisma.$TrafegoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Trafegos.
     * @param {TrafegoCreateManyArgs} args - Arguments to create many Trafegos.
     * @example
     * // Create many Trafegos
     * const trafego = await prisma.trafego.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TrafegoCreateManyArgs>(args?: SelectSubset<T, TrafegoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Trafegos and returns the data saved in the database.
     * @param {TrafegoCreateManyAndReturnArgs} args - Arguments to create many Trafegos.
     * @example
     * // Create many Trafegos
     * const trafego = await prisma.trafego.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Trafegos and only return the `id`
     * const trafegoWithIdOnly = await prisma.trafego.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TrafegoCreateManyAndReturnArgs>(args?: SelectSubset<T, TrafegoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrafegoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Trafego.
     * @param {TrafegoDeleteArgs} args - Arguments to delete one Trafego.
     * @example
     * // Delete one Trafego
     * const Trafego = await prisma.trafego.delete({
     *   where: {
     *     // ... filter to delete one Trafego
     *   }
     * })
     * 
     */
    delete<T extends TrafegoDeleteArgs>(args: SelectSubset<T, TrafegoDeleteArgs<ExtArgs>>): Prisma__TrafegoClient<$Result.GetResult<Prisma.$TrafegoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Trafego.
     * @param {TrafegoUpdateArgs} args - Arguments to update one Trafego.
     * @example
     * // Update one Trafego
     * const trafego = await prisma.trafego.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TrafegoUpdateArgs>(args: SelectSubset<T, TrafegoUpdateArgs<ExtArgs>>): Prisma__TrafegoClient<$Result.GetResult<Prisma.$TrafegoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Trafegos.
     * @param {TrafegoDeleteManyArgs} args - Arguments to filter Trafegos to delete.
     * @example
     * // Delete a few Trafegos
     * const { count } = await prisma.trafego.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TrafegoDeleteManyArgs>(args?: SelectSubset<T, TrafegoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Trafegos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrafegoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Trafegos
     * const trafego = await prisma.trafego.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TrafegoUpdateManyArgs>(args: SelectSubset<T, TrafegoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Trafegos and returns the data updated in the database.
     * @param {TrafegoUpdateManyAndReturnArgs} args - Arguments to update many Trafegos.
     * @example
     * // Update many Trafegos
     * const trafego = await prisma.trafego.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Trafegos and only return the `id`
     * const trafegoWithIdOnly = await prisma.trafego.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TrafegoUpdateManyAndReturnArgs>(args: SelectSubset<T, TrafegoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrafegoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Trafego.
     * @param {TrafegoUpsertArgs} args - Arguments to update or create a Trafego.
     * @example
     * // Update or create a Trafego
     * const trafego = await prisma.trafego.upsert({
     *   create: {
     *     // ... data to create a Trafego
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Trafego we want to update
     *   }
     * })
     */
    upsert<T extends TrafegoUpsertArgs>(args: SelectSubset<T, TrafegoUpsertArgs<ExtArgs>>): Prisma__TrafegoClient<$Result.GetResult<Prisma.$TrafegoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Trafegos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrafegoCountArgs} args - Arguments to filter Trafegos to count.
     * @example
     * // Count the number of Trafegos
     * const count = await prisma.trafego.count({
     *   where: {
     *     // ... the filter for the Trafegos we want to count
     *   }
     * })
    **/
    count<T extends TrafegoCountArgs>(
      args?: Subset<T, TrafegoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TrafegoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Trafego.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrafegoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TrafegoAggregateArgs>(args: Subset<T, TrafegoAggregateArgs>): Prisma.PrismaPromise<GetTrafegoAggregateType<T>>

    /**
     * Group by Trafego.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrafegoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TrafegoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TrafegoGroupByArgs['orderBy'] }
        : { orderBy?: TrafegoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TrafegoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTrafegoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Trafego model
   */
  readonly fields: TrafegoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Trafego.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TrafegoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    dashboard<T extends DashboardMarketingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DashboardMarketingDefaultArgs<ExtArgs>>): Prisma__DashboardMarketingClient<$Result.GetResult<Prisma.$DashboardMarketingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Trafego model
   */
  interface TrafegoFieldRefs {
    readonly id: FieldRef<"Trafego", 'String'>
    readonly dashboardId: FieldRef<"Trafego", 'String'>
    readonly origem: FieldRef<"Trafego", 'String'>
    readonly valor: FieldRef<"Trafego", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Trafego findUnique
   */
  export type TrafegoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trafego
     */
    select?: TrafegoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trafego
     */
    omit?: TrafegoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrafegoInclude<ExtArgs> | null
    /**
     * Filter, which Trafego to fetch.
     */
    where: TrafegoWhereUniqueInput
  }

  /**
   * Trafego findUniqueOrThrow
   */
  export type TrafegoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trafego
     */
    select?: TrafegoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trafego
     */
    omit?: TrafegoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrafegoInclude<ExtArgs> | null
    /**
     * Filter, which Trafego to fetch.
     */
    where: TrafegoWhereUniqueInput
  }

  /**
   * Trafego findFirst
   */
  export type TrafegoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trafego
     */
    select?: TrafegoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trafego
     */
    omit?: TrafegoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrafegoInclude<ExtArgs> | null
    /**
     * Filter, which Trafego to fetch.
     */
    where?: TrafegoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Trafegos to fetch.
     */
    orderBy?: TrafegoOrderByWithRelationInput | TrafegoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Trafegos.
     */
    cursor?: TrafegoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Trafegos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Trafegos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Trafegos.
     */
    distinct?: TrafegoScalarFieldEnum | TrafegoScalarFieldEnum[]
  }

  /**
   * Trafego findFirstOrThrow
   */
  export type TrafegoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trafego
     */
    select?: TrafegoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trafego
     */
    omit?: TrafegoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrafegoInclude<ExtArgs> | null
    /**
     * Filter, which Trafego to fetch.
     */
    where?: TrafegoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Trafegos to fetch.
     */
    orderBy?: TrafegoOrderByWithRelationInput | TrafegoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Trafegos.
     */
    cursor?: TrafegoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Trafegos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Trafegos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Trafegos.
     */
    distinct?: TrafegoScalarFieldEnum | TrafegoScalarFieldEnum[]
  }

  /**
   * Trafego findMany
   */
  export type TrafegoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trafego
     */
    select?: TrafegoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trafego
     */
    omit?: TrafegoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrafegoInclude<ExtArgs> | null
    /**
     * Filter, which Trafegos to fetch.
     */
    where?: TrafegoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Trafegos to fetch.
     */
    orderBy?: TrafegoOrderByWithRelationInput | TrafegoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Trafegos.
     */
    cursor?: TrafegoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Trafegos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Trafegos.
     */
    skip?: number
    distinct?: TrafegoScalarFieldEnum | TrafegoScalarFieldEnum[]
  }

  /**
   * Trafego create
   */
  export type TrafegoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trafego
     */
    select?: TrafegoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trafego
     */
    omit?: TrafegoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrafegoInclude<ExtArgs> | null
    /**
     * The data needed to create a Trafego.
     */
    data: XOR<TrafegoCreateInput, TrafegoUncheckedCreateInput>
  }

  /**
   * Trafego createMany
   */
  export type TrafegoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Trafegos.
     */
    data: TrafegoCreateManyInput | TrafegoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Trafego createManyAndReturn
   */
  export type TrafegoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trafego
     */
    select?: TrafegoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Trafego
     */
    omit?: TrafegoOmit<ExtArgs> | null
    /**
     * The data used to create many Trafegos.
     */
    data: TrafegoCreateManyInput | TrafegoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrafegoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Trafego update
   */
  export type TrafegoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trafego
     */
    select?: TrafegoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trafego
     */
    omit?: TrafegoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrafegoInclude<ExtArgs> | null
    /**
     * The data needed to update a Trafego.
     */
    data: XOR<TrafegoUpdateInput, TrafegoUncheckedUpdateInput>
    /**
     * Choose, which Trafego to update.
     */
    where: TrafegoWhereUniqueInput
  }

  /**
   * Trafego updateMany
   */
  export type TrafegoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Trafegos.
     */
    data: XOR<TrafegoUpdateManyMutationInput, TrafegoUncheckedUpdateManyInput>
    /**
     * Filter which Trafegos to update
     */
    where?: TrafegoWhereInput
    /**
     * Limit how many Trafegos to update.
     */
    limit?: number
  }

  /**
   * Trafego updateManyAndReturn
   */
  export type TrafegoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trafego
     */
    select?: TrafegoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Trafego
     */
    omit?: TrafegoOmit<ExtArgs> | null
    /**
     * The data used to update Trafegos.
     */
    data: XOR<TrafegoUpdateManyMutationInput, TrafegoUncheckedUpdateManyInput>
    /**
     * Filter which Trafegos to update
     */
    where?: TrafegoWhereInput
    /**
     * Limit how many Trafegos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrafegoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Trafego upsert
   */
  export type TrafegoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trafego
     */
    select?: TrafegoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trafego
     */
    omit?: TrafegoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrafegoInclude<ExtArgs> | null
    /**
     * The filter to search for the Trafego to update in case it exists.
     */
    where: TrafegoWhereUniqueInput
    /**
     * In case the Trafego found by the `where` argument doesn't exist, create a new Trafego with this data.
     */
    create: XOR<TrafegoCreateInput, TrafegoUncheckedCreateInput>
    /**
     * In case the Trafego was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TrafegoUpdateInput, TrafegoUncheckedUpdateInput>
  }

  /**
   * Trafego delete
   */
  export type TrafegoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trafego
     */
    select?: TrafegoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trafego
     */
    omit?: TrafegoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrafegoInclude<ExtArgs> | null
    /**
     * Filter which Trafego to delete.
     */
    where: TrafegoWhereUniqueInput
  }

  /**
   * Trafego deleteMany
   */
  export type TrafegoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Trafegos to delete
     */
    where?: TrafegoWhereInput
    /**
     * Limit how many Trafegos to delete.
     */
    limit?: number
  }

  /**
   * Trafego without action
   */
  export type TrafegoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trafego
     */
    select?: TrafegoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trafego
     */
    omit?: TrafegoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrafegoInclude<ExtArgs> | null
  }


  /**
   * Model CanalTrafego
   */

  export type AggregateCanalTrafego = {
    _count: CanalTrafegoCountAggregateOutputType | null
    _avg: CanalTrafegoAvgAggregateOutputType | null
    _sum: CanalTrafegoSumAggregateOutputType | null
    _min: CanalTrafegoMinAggregateOutputType | null
    _max: CanalTrafegoMaxAggregateOutputType | null
  }

  export type CanalTrafegoAvgAggregateOutputType = {
    taxaConversao: number | null
    cpa: Decimal | null
    roi: number | null
  }

  export type CanalTrafegoSumAggregateOutputType = {
    taxaConversao: number | null
    cpa: Decimal | null
    roi: number | null
  }

  export type CanalTrafegoMinAggregateOutputType = {
    id: string | null
    dashboardId: string | null
    canal: string | null
    taxaConversao: number | null
    cpa: Decimal | null
    roi: number | null
  }

  export type CanalTrafegoMaxAggregateOutputType = {
    id: string | null
    dashboardId: string | null
    canal: string | null
    taxaConversao: number | null
    cpa: Decimal | null
    roi: number | null
  }

  export type CanalTrafegoCountAggregateOutputType = {
    id: number
    dashboardId: number
    canal: number
    taxaConversao: number
    cpa: number
    roi: number
    _all: number
  }


  export type CanalTrafegoAvgAggregateInputType = {
    taxaConversao?: true
    cpa?: true
    roi?: true
  }

  export type CanalTrafegoSumAggregateInputType = {
    taxaConversao?: true
    cpa?: true
    roi?: true
  }

  export type CanalTrafegoMinAggregateInputType = {
    id?: true
    dashboardId?: true
    canal?: true
    taxaConversao?: true
    cpa?: true
    roi?: true
  }

  export type CanalTrafegoMaxAggregateInputType = {
    id?: true
    dashboardId?: true
    canal?: true
    taxaConversao?: true
    cpa?: true
    roi?: true
  }

  export type CanalTrafegoCountAggregateInputType = {
    id?: true
    dashboardId?: true
    canal?: true
    taxaConversao?: true
    cpa?: true
    roi?: true
    _all?: true
  }

  export type CanalTrafegoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CanalTrafego to aggregate.
     */
    where?: CanalTrafegoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CanalTrafegos to fetch.
     */
    orderBy?: CanalTrafegoOrderByWithRelationInput | CanalTrafegoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CanalTrafegoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CanalTrafegos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CanalTrafegos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CanalTrafegos
    **/
    _count?: true | CanalTrafegoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CanalTrafegoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CanalTrafegoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CanalTrafegoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CanalTrafegoMaxAggregateInputType
  }

  export type GetCanalTrafegoAggregateType<T extends CanalTrafegoAggregateArgs> = {
        [P in keyof T & keyof AggregateCanalTrafego]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCanalTrafego[P]>
      : GetScalarType<T[P], AggregateCanalTrafego[P]>
  }




  export type CanalTrafegoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CanalTrafegoWhereInput
    orderBy?: CanalTrafegoOrderByWithAggregationInput | CanalTrafegoOrderByWithAggregationInput[]
    by: CanalTrafegoScalarFieldEnum[] | CanalTrafegoScalarFieldEnum
    having?: CanalTrafegoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CanalTrafegoCountAggregateInputType | true
    _avg?: CanalTrafegoAvgAggregateInputType
    _sum?: CanalTrafegoSumAggregateInputType
    _min?: CanalTrafegoMinAggregateInputType
    _max?: CanalTrafegoMaxAggregateInputType
  }

  export type CanalTrafegoGroupByOutputType = {
    id: string
    dashboardId: string
    canal: string
    taxaConversao: number
    cpa: Decimal
    roi: number
    _count: CanalTrafegoCountAggregateOutputType | null
    _avg: CanalTrafegoAvgAggregateOutputType | null
    _sum: CanalTrafegoSumAggregateOutputType | null
    _min: CanalTrafegoMinAggregateOutputType | null
    _max: CanalTrafegoMaxAggregateOutputType | null
  }

  type GetCanalTrafegoGroupByPayload<T extends CanalTrafegoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CanalTrafegoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CanalTrafegoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CanalTrafegoGroupByOutputType[P]>
            : GetScalarType<T[P], CanalTrafegoGroupByOutputType[P]>
        }
      >
    >


  export type CanalTrafegoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dashboardId?: boolean
    canal?: boolean
    taxaConversao?: boolean
    cpa?: boolean
    roi?: boolean
    dashboard?: boolean | DashboardMarketingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["canalTrafego"]>

  export type CanalTrafegoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dashboardId?: boolean
    canal?: boolean
    taxaConversao?: boolean
    cpa?: boolean
    roi?: boolean
    dashboard?: boolean | DashboardMarketingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["canalTrafego"]>

  export type CanalTrafegoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dashboardId?: boolean
    canal?: boolean
    taxaConversao?: boolean
    cpa?: boolean
    roi?: boolean
    dashboard?: boolean | DashboardMarketingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["canalTrafego"]>

  export type CanalTrafegoSelectScalar = {
    id?: boolean
    dashboardId?: boolean
    canal?: boolean
    taxaConversao?: boolean
    cpa?: boolean
    roi?: boolean
  }

  export type CanalTrafegoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "dashboardId" | "canal" | "taxaConversao" | "cpa" | "roi", ExtArgs["result"]["canalTrafego"]>
  export type CanalTrafegoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dashboard?: boolean | DashboardMarketingDefaultArgs<ExtArgs>
  }
  export type CanalTrafegoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dashboard?: boolean | DashboardMarketingDefaultArgs<ExtArgs>
  }
  export type CanalTrafegoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dashboard?: boolean | DashboardMarketingDefaultArgs<ExtArgs>
  }

  export type $CanalTrafegoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CanalTrafego"
    objects: {
      dashboard: Prisma.$DashboardMarketingPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      dashboardId: string
      canal: string
      taxaConversao: number
      cpa: Prisma.Decimal
      roi: number
    }, ExtArgs["result"]["canalTrafego"]>
    composites: {}
  }

  type CanalTrafegoGetPayload<S extends boolean | null | undefined | CanalTrafegoDefaultArgs> = $Result.GetResult<Prisma.$CanalTrafegoPayload, S>

  type CanalTrafegoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CanalTrafegoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CanalTrafegoCountAggregateInputType | true
    }

  export interface CanalTrafegoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CanalTrafego'], meta: { name: 'CanalTrafego' } }
    /**
     * Find zero or one CanalTrafego that matches the filter.
     * @param {CanalTrafegoFindUniqueArgs} args - Arguments to find a CanalTrafego
     * @example
     * // Get one CanalTrafego
     * const canalTrafego = await prisma.canalTrafego.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CanalTrafegoFindUniqueArgs>(args: SelectSubset<T, CanalTrafegoFindUniqueArgs<ExtArgs>>): Prisma__CanalTrafegoClient<$Result.GetResult<Prisma.$CanalTrafegoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CanalTrafego that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CanalTrafegoFindUniqueOrThrowArgs} args - Arguments to find a CanalTrafego
     * @example
     * // Get one CanalTrafego
     * const canalTrafego = await prisma.canalTrafego.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CanalTrafegoFindUniqueOrThrowArgs>(args: SelectSubset<T, CanalTrafegoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CanalTrafegoClient<$Result.GetResult<Prisma.$CanalTrafegoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CanalTrafego that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanalTrafegoFindFirstArgs} args - Arguments to find a CanalTrafego
     * @example
     * // Get one CanalTrafego
     * const canalTrafego = await prisma.canalTrafego.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CanalTrafegoFindFirstArgs>(args?: SelectSubset<T, CanalTrafegoFindFirstArgs<ExtArgs>>): Prisma__CanalTrafegoClient<$Result.GetResult<Prisma.$CanalTrafegoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CanalTrafego that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanalTrafegoFindFirstOrThrowArgs} args - Arguments to find a CanalTrafego
     * @example
     * // Get one CanalTrafego
     * const canalTrafego = await prisma.canalTrafego.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CanalTrafegoFindFirstOrThrowArgs>(args?: SelectSubset<T, CanalTrafegoFindFirstOrThrowArgs<ExtArgs>>): Prisma__CanalTrafegoClient<$Result.GetResult<Prisma.$CanalTrafegoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CanalTrafegos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanalTrafegoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CanalTrafegos
     * const canalTrafegos = await prisma.canalTrafego.findMany()
     * 
     * // Get first 10 CanalTrafegos
     * const canalTrafegos = await prisma.canalTrafego.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const canalTrafegoWithIdOnly = await prisma.canalTrafego.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CanalTrafegoFindManyArgs>(args?: SelectSubset<T, CanalTrafegoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CanalTrafegoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CanalTrafego.
     * @param {CanalTrafegoCreateArgs} args - Arguments to create a CanalTrafego.
     * @example
     * // Create one CanalTrafego
     * const CanalTrafego = await prisma.canalTrafego.create({
     *   data: {
     *     // ... data to create a CanalTrafego
     *   }
     * })
     * 
     */
    create<T extends CanalTrafegoCreateArgs>(args: SelectSubset<T, CanalTrafegoCreateArgs<ExtArgs>>): Prisma__CanalTrafegoClient<$Result.GetResult<Prisma.$CanalTrafegoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CanalTrafegos.
     * @param {CanalTrafegoCreateManyArgs} args - Arguments to create many CanalTrafegos.
     * @example
     * // Create many CanalTrafegos
     * const canalTrafego = await prisma.canalTrafego.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CanalTrafegoCreateManyArgs>(args?: SelectSubset<T, CanalTrafegoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CanalTrafegos and returns the data saved in the database.
     * @param {CanalTrafegoCreateManyAndReturnArgs} args - Arguments to create many CanalTrafegos.
     * @example
     * // Create many CanalTrafegos
     * const canalTrafego = await prisma.canalTrafego.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CanalTrafegos and only return the `id`
     * const canalTrafegoWithIdOnly = await prisma.canalTrafego.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CanalTrafegoCreateManyAndReturnArgs>(args?: SelectSubset<T, CanalTrafegoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CanalTrafegoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CanalTrafego.
     * @param {CanalTrafegoDeleteArgs} args - Arguments to delete one CanalTrafego.
     * @example
     * // Delete one CanalTrafego
     * const CanalTrafego = await prisma.canalTrafego.delete({
     *   where: {
     *     // ... filter to delete one CanalTrafego
     *   }
     * })
     * 
     */
    delete<T extends CanalTrafegoDeleteArgs>(args: SelectSubset<T, CanalTrafegoDeleteArgs<ExtArgs>>): Prisma__CanalTrafegoClient<$Result.GetResult<Prisma.$CanalTrafegoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CanalTrafego.
     * @param {CanalTrafegoUpdateArgs} args - Arguments to update one CanalTrafego.
     * @example
     * // Update one CanalTrafego
     * const canalTrafego = await prisma.canalTrafego.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CanalTrafegoUpdateArgs>(args: SelectSubset<T, CanalTrafegoUpdateArgs<ExtArgs>>): Prisma__CanalTrafegoClient<$Result.GetResult<Prisma.$CanalTrafegoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CanalTrafegos.
     * @param {CanalTrafegoDeleteManyArgs} args - Arguments to filter CanalTrafegos to delete.
     * @example
     * // Delete a few CanalTrafegos
     * const { count } = await prisma.canalTrafego.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CanalTrafegoDeleteManyArgs>(args?: SelectSubset<T, CanalTrafegoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CanalTrafegos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanalTrafegoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CanalTrafegos
     * const canalTrafego = await prisma.canalTrafego.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CanalTrafegoUpdateManyArgs>(args: SelectSubset<T, CanalTrafegoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CanalTrafegos and returns the data updated in the database.
     * @param {CanalTrafegoUpdateManyAndReturnArgs} args - Arguments to update many CanalTrafegos.
     * @example
     * // Update many CanalTrafegos
     * const canalTrafego = await prisma.canalTrafego.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CanalTrafegos and only return the `id`
     * const canalTrafegoWithIdOnly = await prisma.canalTrafego.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CanalTrafegoUpdateManyAndReturnArgs>(args: SelectSubset<T, CanalTrafegoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CanalTrafegoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CanalTrafego.
     * @param {CanalTrafegoUpsertArgs} args - Arguments to update or create a CanalTrafego.
     * @example
     * // Update or create a CanalTrafego
     * const canalTrafego = await prisma.canalTrafego.upsert({
     *   create: {
     *     // ... data to create a CanalTrafego
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CanalTrafego we want to update
     *   }
     * })
     */
    upsert<T extends CanalTrafegoUpsertArgs>(args: SelectSubset<T, CanalTrafegoUpsertArgs<ExtArgs>>): Prisma__CanalTrafegoClient<$Result.GetResult<Prisma.$CanalTrafegoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CanalTrafegos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanalTrafegoCountArgs} args - Arguments to filter CanalTrafegos to count.
     * @example
     * // Count the number of CanalTrafegos
     * const count = await prisma.canalTrafego.count({
     *   where: {
     *     // ... the filter for the CanalTrafegos we want to count
     *   }
     * })
    **/
    count<T extends CanalTrafegoCountArgs>(
      args?: Subset<T, CanalTrafegoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CanalTrafegoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CanalTrafego.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanalTrafegoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CanalTrafegoAggregateArgs>(args: Subset<T, CanalTrafegoAggregateArgs>): Prisma.PrismaPromise<GetCanalTrafegoAggregateType<T>>

    /**
     * Group by CanalTrafego.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CanalTrafegoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CanalTrafegoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CanalTrafegoGroupByArgs['orderBy'] }
        : { orderBy?: CanalTrafegoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CanalTrafegoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCanalTrafegoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CanalTrafego model
   */
  readonly fields: CanalTrafegoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CanalTrafego.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CanalTrafegoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    dashboard<T extends DashboardMarketingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DashboardMarketingDefaultArgs<ExtArgs>>): Prisma__DashboardMarketingClient<$Result.GetResult<Prisma.$DashboardMarketingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CanalTrafego model
   */
  interface CanalTrafegoFieldRefs {
    readonly id: FieldRef<"CanalTrafego", 'String'>
    readonly dashboardId: FieldRef<"CanalTrafego", 'String'>
    readonly canal: FieldRef<"CanalTrafego", 'String'>
    readonly taxaConversao: FieldRef<"CanalTrafego", 'Float'>
    readonly cpa: FieldRef<"CanalTrafego", 'Decimal'>
    readonly roi: FieldRef<"CanalTrafego", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * CanalTrafego findUnique
   */
  export type CanalTrafegoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanalTrafego
     */
    select?: CanalTrafegoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CanalTrafego
     */
    omit?: CanalTrafegoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanalTrafegoInclude<ExtArgs> | null
    /**
     * Filter, which CanalTrafego to fetch.
     */
    where: CanalTrafegoWhereUniqueInput
  }

  /**
   * CanalTrafego findUniqueOrThrow
   */
  export type CanalTrafegoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanalTrafego
     */
    select?: CanalTrafegoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CanalTrafego
     */
    omit?: CanalTrafegoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanalTrafegoInclude<ExtArgs> | null
    /**
     * Filter, which CanalTrafego to fetch.
     */
    where: CanalTrafegoWhereUniqueInput
  }

  /**
   * CanalTrafego findFirst
   */
  export type CanalTrafegoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanalTrafego
     */
    select?: CanalTrafegoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CanalTrafego
     */
    omit?: CanalTrafegoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanalTrafegoInclude<ExtArgs> | null
    /**
     * Filter, which CanalTrafego to fetch.
     */
    where?: CanalTrafegoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CanalTrafegos to fetch.
     */
    orderBy?: CanalTrafegoOrderByWithRelationInput | CanalTrafegoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CanalTrafegos.
     */
    cursor?: CanalTrafegoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CanalTrafegos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CanalTrafegos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CanalTrafegos.
     */
    distinct?: CanalTrafegoScalarFieldEnum | CanalTrafegoScalarFieldEnum[]
  }

  /**
   * CanalTrafego findFirstOrThrow
   */
  export type CanalTrafegoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanalTrafego
     */
    select?: CanalTrafegoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CanalTrafego
     */
    omit?: CanalTrafegoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanalTrafegoInclude<ExtArgs> | null
    /**
     * Filter, which CanalTrafego to fetch.
     */
    where?: CanalTrafegoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CanalTrafegos to fetch.
     */
    orderBy?: CanalTrafegoOrderByWithRelationInput | CanalTrafegoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CanalTrafegos.
     */
    cursor?: CanalTrafegoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CanalTrafegos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CanalTrafegos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CanalTrafegos.
     */
    distinct?: CanalTrafegoScalarFieldEnum | CanalTrafegoScalarFieldEnum[]
  }

  /**
   * CanalTrafego findMany
   */
  export type CanalTrafegoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanalTrafego
     */
    select?: CanalTrafegoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CanalTrafego
     */
    omit?: CanalTrafegoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanalTrafegoInclude<ExtArgs> | null
    /**
     * Filter, which CanalTrafegos to fetch.
     */
    where?: CanalTrafegoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CanalTrafegos to fetch.
     */
    orderBy?: CanalTrafegoOrderByWithRelationInput | CanalTrafegoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CanalTrafegos.
     */
    cursor?: CanalTrafegoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CanalTrafegos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CanalTrafegos.
     */
    skip?: number
    distinct?: CanalTrafegoScalarFieldEnum | CanalTrafegoScalarFieldEnum[]
  }

  /**
   * CanalTrafego create
   */
  export type CanalTrafegoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanalTrafego
     */
    select?: CanalTrafegoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CanalTrafego
     */
    omit?: CanalTrafegoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanalTrafegoInclude<ExtArgs> | null
    /**
     * The data needed to create a CanalTrafego.
     */
    data: XOR<CanalTrafegoCreateInput, CanalTrafegoUncheckedCreateInput>
  }

  /**
   * CanalTrafego createMany
   */
  export type CanalTrafegoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CanalTrafegos.
     */
    data: CanalTrafegoCreateManyInput | CanalTrafegoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CanalTrafego createManyAndReturn
   */
  export type CanalTrafegoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanalTrafego
     */
    select?: CanalTrafegoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CanalTrafego
     */
    omit?: CanalTrafegoOmit<ExtArgs> | null
    /**
     * The data used to create many CanalTrafegos.
     */
    data: CanalTrafegoCreateManyInput | CanalTrafegoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanalTrafegoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CanalTrafego update
   */
  export type CanalTrafegoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanalTrafego
     */
    select?: CanalTrafegoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CanalTrafego
     */
    omit?: CanalTrafegoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanalTrafegoInclude<ExtArgs> | null
    /**
     * The data needed to update a CanalTrafego.
     */
    data: XOR<CanalTrafegoUpdateInput, CanalTrafegoUncheckedUpdateInput>
    /**
     * Choose, which CanalTrafego to update.
     */
    where: CanalTrafegoWhereUniqueInput
  }

  /**
   * CanalTrafego updateMany
   */
  export type CanalTrafegoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CanalTrafegos.
     */
    data: XOR<CanalTrafegoUpdateManyMutationInput, CanalTrafegoUncheckedUpdateManyInput>
    /**
     * Filter which CanalTrafegos to update
     */
    where?: CanalTrafegoWhereInput
    /**
     * Limit how many CanalTrafegos to update.
     */
    limit?: number
  }

  /**
   * CanalTrafego updateManyAndReturn
   */
  export type CanalTrafegoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanalTrafego
     */
    select?: CanalTrafegoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CanalTrafego
     */
    omit?: CanalTrafegoOmit<ExtArgs> | null
    /**
     * The data used to update CanalTrafegos.
     */
    data: XOR<CanalTrafegoUpdateManyMutationInput, CanalTrafegoUncheckedUpdateManyInput>
    /**
     * Filter which CanalTrafegos to update
     */
    where?: CanalTrafegoWhereInput
    /**
     * Limit how many CanalTrafegos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanalTrafegoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CanalTrafego upsert
   */
  export type CanalTrafegoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanalTrafego
     */
    select?: CanalTrafegoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CanalTrafego
     */
    omit?: CanalTrafegoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanalTrafegoInclude<ExtArgs> | null
    /**
     * The filter to search for the CanalTrafego to update in case it exists.
     */
    where: CanalTrafegoWhereUniqueInput
    /**
     * In case the CanalTrafego found by the `where` argument doesn't exist, create a new CanalTrafego with this data.
     */
    create: XOR<CanalTrafegoCreateInput, CanalTrafegoUncheckedCreateInput>
    /**
     * In case the CanalTrafego was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CanalTrafegoUpdateInput, CanalTrafegoUncheckedUpdateInput>
  }

  /**
   * CanalTrafego delete
   */
  export type CanalTrafegoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanalTrafego
     */
    select?: CanalTrafegoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CanalTrafego
     */
    omit?: CanalTrafegoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanalTrafegoInclude<ExtArgs> | null
    /**
     * Filter which CanalTrafego to delete.
     */
    where: CanalTrafegoWhereUniqueInput
  }

  /**
   * CanalTrafego deleteMany
   */
  export type CanalTrafegoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CanalTrafegos to delete
     */
    where?: CanalTrafegoWhereInput
    /**
     * Limit how many CanalTrafegos to delete.
     */
    limit?: number
  }

  /**
   * CanalTrafego without action
   */
  export type CanalTrafegoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CanalTrafego
     */
    select?: CanalTrafegoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CanalTrafego
     */
    omit?: CanalTrafegoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CanalTrafegoInclude<ExtArgs> | null
  }


  /**
   * Model AnuncioCTR
   */

  export type AggregateAnuncioCTR = {
    _count: AnuncioCTRCountAggregateOutputType | null
    _avg: AnuncioCTRAvgAggregateOutputType | null
    _sum: AnuncioCTRSumAggregateOutputType | null
    _min: AnuncioCTRMinAggregateOutputType | null
    _max: AnuncioCTRMaxAggregateOutputType | null
  }

  export type AnuncioCTRAvgAggregateOutputType = {
    ctr: number | null
  }

  export type AnuncioCTRSumAggregateOutputType = {
    ctr: number | null
  }

  export type AnuncioCTRMinAggregateOutputType = {
    id: string | null
    dashboardId: string | null
    nome: string | null
    ctr: number | null
  }

  export type AnuncioCTRMaxAggregateOutputType = {
    id: string | null
    dashboardId: string | null
    nome: string | null
    ctr: number | null
  }

  export type AnuncioCTRCountAggregateOutputType = {
    id: number
    dashboardId: number
    nome: number
    ctr: number
    _all: number
  }


  export type AnuncioCTRAvgAggregateInputType = {
    ctr?: true
  }

  export type AnuncioCTRSumAggregateInputType = {
    ctr?: true
  }

  export type AnuncioCTRMinAggregateInputType = {
    id?: true
    dashboardId?: true
    nome?: true
    ctr?: true
  }

  export type AnuncioCTRMaxAggregateInputType = {
    id?: true
    dashboardId?: true
    nome?: true
    ctr?: true
  }

  export type AnuncioCTRCountAggregateInputType = {
    id?: true
    dashboardId?: true
    nome?: true
    ctr?: true
    _all?: true
  }

  export type AnuncioCTRAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnuncioCTR to aggregate.
     */
    where?: AnuncioCTRWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnuncioCTRS to fetch.
     */
    orderBy?: AnuncioCTROrderByWithRelationInput | AnuncioCTROrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AnuncioCTRWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnuncioCTRS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnuncioCTRS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AnuncioCTRS
    **/
    _count?: true | AnuncioCTRCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AnuncioCTRAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AnuncioCTRSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AnuncioCTRMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AnuncioCTRMaxAggregateInputType
  }

  export type GetAnuncioCTRAggregateType<T extends AnuncioCTRAggregateArgs> = {
        [P in keyof T & keyof AggregateAnuncioCTR]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAnuncioCTR[P]>
      : GetScalarType<T[P], AggregateAnuncioCTR[P]>
  }




  export type AnuncioCTRGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnuncioCTRWhereInput
    orderBy?: AnuncioCTROrderByWithAggregationInput | AnuncioCTROrderByWithAggregationInput[]
    by: AnuncioCTRScalarFieldEnum[] | AnuncioCTRScalarFieldEnum
    having?: AnuncioCTRScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AnuncioCTRCountAggregateInputType | true
    _avg?: AnuncioCTRAvgAggregateInputType
    _sum?: AnuncioCTRSumAggregateInputType
    _min?: AnuncioCTRMinAggregateInputType
    _max?: AnuncioCTRMaxAggregateInputType
  }

  export type AnuncioCTRGroupByOutputType = {
    id: string
    dashboardId: string
    nome: string
    ctr: number
    _count: AnuncioCTRCountAggregateOutputType | null
    _avg: AnuncioCTRAvgAggregateOutputType | null
    _sum: AnuncioCTRSumAggregateOutputType | null
    _min: AnuncioCTRMinAggregateOutputType | null
    _max: AnuncioCTRMaxAggregateOutputType | null
  }

  type GetAnuncioCTRGroupByPayload<T extends AnuncioCTRGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AnuncioCTRGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AnuncioCTRGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AnuncioCTRGroupByOutputType[P]>
            : GetScalarType<T[P], AnuncioCTRGroupByOutputType[P]>
        }
      >
    >


  export type AnuncioCTRSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dashboardId?: boolean
    nome?: boolean
    ctr?: boolean
    dashboard?: boolean | DashboardMarketingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["anuncioCTR"]>

  export type AnuncioCTRSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dashboardId?: boolean
    nome?: boolean
    ctr?: boolean
    dashboard?: boolean | DashboardMarketingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["anuncioCTR"]>

  export type AnuncioCTRSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dashboardId?: boolean
    nome?: boolean
    ctr?: boolean
    dashboard?: boolean | DashboardMarketingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["anuncioCTR"]>

  export type AnuncioCTRSelectScalar = {
    id?: boolean
    dashboardId?: boolean
    nome?: boolean
    ctr?: boolean
  }

  export type AnuncioCTROmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "dashboardId" | "nome" | "ctr", ExtArgs["result"]["anuncioCTR"]>
  export type AnuncioCTRInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dashboard?: boolean | DashboardMarketingDefaultArgs<ExtArgs>
  }
  export type AnuncioCTRIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dashboard?: boolean | DashboardMarketingDefaultArgs<ExtArgs>
  }
  export type AnuncioCTRIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dashboard?: boolean | DashboardMarketingDefaultArgs<ExtArgs>
  }

  export type $AnuncioCTRPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AnuncioCTR"
    objects: {
      dashboard: Prisma.$DashboardMarketingPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      dashboardId: string
      nome: string
      ctr: number
    }, ExtArgs["result"]["anuncioCTR"]>
    composites: {}
  }

  type AnuncioCTRGetPayload<S extends boolean | null | undefined | AnuncioCTRDefaultArgs> = $Result.GetResult<Prisma.$AnuncioCTRPayload, S>

  type AnuncioCTRCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AnuncioCTRFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AnuncioCTRCountAggregateInputType | true
    }

  export interface AnuncioCTRDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AnuncioCTR'], meta: { name: 'AnuncioCTR' } }
    /**
     * Find zero or one AnuncioCTR that matches the filter.
     * @param {AnuncioCTRFindUniqueArgs} args - Arguments to find a AnuncioCTR
     * @example
     * // Get one AnuncioCTR
     * const anuncioCTR = await prisma.anuncioCTR.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AnuncioCTRFindUniqueArgs>(args: SelectSubset<T, AnuncioCTRFindUniqueArgs<ExtArgs>>): Prisma__AnuncioCTRClient<$Result.GetResult<Prisma.$AnuncioCTRPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AnuncioCTR that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AnuncioCTRFindUniqueOrThrowArgs} args - Arguments to find a AnuncioCTR
     * @example
     * // Get one AnuncioCTR
     * const anuncioCTR = await prisma.anuncioCTR.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AnuncioCTRFindUniqueOrThrowArgs>(args: SelectSubset<T, AnuncioCTRFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AnuncioCTRClient<$Result.GetResult<Prisma.$AnuncioCTRPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AnuncioCTR that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnuncioCTRFindFirstArgs} args - Arguments to find a AnuncioCTR
     * @example
     * // Get one AnuncioCTR
     * const anuncioCTR = await prisma.anuncioCTR.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AnuncioCTRFindFirstArgs>(args?: SelectSubset<T, AnuncioCTRFindFirstArgs<ExtArgs>>): Prisma__AnuncioCTRClient<$Result.GetResult<Prisma.$AnuncioCTRPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AnuncioCTR that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnuncioCTRFindFirstOrThrowArgs} args - Arguments to find a AnuncioCTR
     * @example
     * // Get one AnuncioCTR
     * const anuncioCTR = await prisma.anuncioCTR.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AnuncioCTRFindFirstOrThrowArgs>(args?: SelectSubset<T, AnuncioCTRFindFirstOrThrowArgs<ExtArgs>>): Prisma__AnuncioCTRClient<$Result.GetResult<Prisma.$AnuncioCTRPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AnuncioCTRS that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnuncioCTRFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AnuncioCTRS
     * const anuncioCTRS = await prisma.anuncioCTR.findMany()
     * 
     * // Get first 10 AnuncioCTRS
     * const anuncioCTRS = await prisma.anuncioCTR.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const anuncioCTRWithIdOnly = await prisma.anuncioCTR.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AnuncioCTRFindManyArgs>(args?: SelectSubset<T, AnuncioCTRFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnuncioCTRPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AnuncioCTR.
     * @param {AnuncioCTRCreateArgs} args - Arguments to create a AnuncioCTR.
     * @example
     * // Create one AnuncioCTR
     * const AnuncioCTR = await prisma.anuncioCTR.create({
     *   data: {
     *     // ... data to create a AnuncioCTR
     *   }
     * })
     * 
     */
    create<T extends AnuncioCTRCreateArgs>(args: SelectSubset<T, AnuncioCTRCreateArgs<ExtArgs>>): Prisma__AnuncioCTRClient<$Result.GetResult<Prisma.$AnuncioCTRPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AnuncioCTRS.
     * @param {AnuncioCTRCreateManyArgs} args - Arguments to create many AnuncioCTRS.
     * @example
     * // Create many AnuncioCTRS
     * const anuncioCTR = await prisma.anuncioCTR.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AnuncioCTRCreateManyArgs>(args?: SelectSubset<T, AnuncioCTRCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AnuncioCTRS and returns the data saved in the database.
     * @param {AnuncioCTRCreateManyAndReturnArgs} args - Arguments to create many AnuncioCTRS.
     * @example
     * // Create many AnuncioCTRS
     * const anuncioCTR = await prisma.anuncioCTR.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AnuncioCTRS and only return the `id`
     * const anuncioCTRWithIdOnly = await prisma.anuncioCTR.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AnuncioCTRCreateManyAndReturnArgs>(args?: SelectSubset<T, AnuncioCTRCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnuncioCTRPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AnuncioCTR.
     * @param {AnuncioCTRDeleteArgs} args - Arguments to delete one AnuncioCTR.
     * @example
     * // Delete one AnuncioCTR
     * const AnuncioCTR = await prisma.anuncioCTR.delete({
     *   where: {
     *     // ... filter to delete one AnuncioCTR
     *   }
     * })
     * 
     */
    delete<T extends AnuncioCTRDeleteArgs>(args: SelectSubset<T, AnuncioCTRDeleteArgs<ExtArgs>>): Prisma__AnuncioCTRClient<$Result.GetResult<Prisma.$AnuncioCTRPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AnuncioCTR.
     * @param {AnuncioCTRUpdateArgs} args - Arguments to update one AnuncioCTR.
     * @example
     * // Update one AnuncioCTR
     * const anuncioCTR = await prisma.anuncioCTR.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AnuncioCTRUpdateArgs>(args: SelectSubset<T, AnuncioCTRUpdateArgs<ExtArgs>>): Prisma__AnuncioCTRClient<$Result.GetResult<Prisma.$AnuncioCTRPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AnuncioCTRS.
     * @param {AnuncioCTRDeleteManyArgs} args - Arguments to filter AnuncioCTRS to delete.
     * @example
     * // Delete a few AnuncioCTRS
     * const { count } = await prisma.anuncioCTR.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AnuncioCTRDeleteManyArgs>(args?: SelectSubset<T, AnuncioCTRDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AnuncioCTRS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnuncioCTRUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AnuncioCTRS
     * const anuncioCTR = await prisma.anuncioCTR.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AnuncioCTRUpdateManyArgs>(args: SelectSubset<T, AnuncioCTRUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AnuncioCTRS and returns the data updated in the database.
     * @param {AnuncioCTRUpdateManyAndReturnArgs} args - Arguments to update many AnuncioCTRS.
     * @example
     * // Update many AnuncioCTRS
     * const anuncioCTR = await prisma.anuncioCTR.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AnuncioCTRS and only return the `id`
     * const anuncioCTRWithIdOnly = await prisma.anuncioCTR.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AnuncioCTRUpdateManyAndReturnArgs>(args: SelectSubset<T, AnuncioCTRUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnuncioCTRPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AnuncioCTR.
     * @param {AnuncioCTRUpsertArgs} args - Arguments to update or create a AnuncioCTR.
     * @example
     * // Update or create a AnuncioCTR
     * const anuncioCTR = await prisma.anuncioCTR.upsert({
     *   create: {
     *     // ... data to create a AnuncioCTR
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AnuncioCTR we want to update
     *   }
     * })
     */
    upsert<T extends AnuncioCTRUpsertArgs>(args: SelectSubset<T, AnuncioCTRUpsertArgs<ExtArgs>>): Prisma__AnuncioCTRClient<$Result.GetResult<Prisma.$AnuncioCTRPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AnuncioCTRS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnuncioCTRCountArgs} args - Arguments to filter AnuncioCTRS to count.
     * @example
     * // Count the number of AnuncioCTRS
     * const count = await prisma.anuncioCTR.count({
     *   where: {
     *     // ... the filter for the AnuncioCTRS we want to count
     *   }
     * })
    **/
    count<T extends AnuncioCTRCountArgs>(
      args?: Subset<T, AnuncioCTRCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AnuncioCTRCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AnuncioCTR.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnuncioCTRAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AnuncioCTRAggregateArgs>(args: Subset<T, AnuncioCTRAggregateArgs>): Prisma.PrismaPromise<GetAnuncioCTRAggregateType<T>>

    /**
     * Group by AnuncioCTR.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnuncioCTRGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AnuncioCTRGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AnuncioCTRGroupByArgs['orderBy'] }
        : { orderBy?: AnuncioCTRGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AnuncioCTRGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAnuncioCTRGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AnuncioCTR model
   */
  readonly fields: AnuncioCTRFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AnuncioCTR.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AnuncioCTRClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    dashboard<T extends DashboardMarketingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DashboardMarketingDefaultArgs<ExtArgs>>): Prisma__DashboardMarketingClient<$Result.GetResult<Prisma.$DashboardMarketingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AnuncioCTR model
   */
  interface AnuncioCTRFieldRefs {
    readonly id: FieldRef<"AnuncioCTR", 'String'>
    readonly dashboardId: FieldRef<"AnuncioCTR", 'String'>
    readonly nome: FieldRef<"AnuncioCTR", 'String'>
    readonly ctr: FieldRef<"AnuncioCTR", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * AnuncioCTR findUnique
   */
  export type AnuncioCTRFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnuncioCTR
     */
    select?: AnuncioCTRSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnuncioCTR
     */
    omit?: AnuncioCTROmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnuncioCTRInclude<ExtArgs> | null
    /**
     * Filter, which AnuncioCTR to fetch.
     */
    where: AnuncioCTRWhereUniqueInput
  }

  /**
   * AnuncioCTR findUniqueOrThrow
   */
  export type AnuncioCTRFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnuncioCTR
     */
    select?: AnuncioCTRSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnuncioCTR
     */
    omit?: AnuncioCTROmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnuncioCTRInclude<ExtArgs> | null
    /**
     * Filter, which AnuncioCTR to fetch.
     */
    where: AnuncioCTRWhereUniqueInput
  }

  /**
   * AnuncioCTR findFirst
   */
  export type AnuncioCTRFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnuncioCTR
     */
    select?: AnuncioCTRSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnuncioCTR
     */
    omit?: AnuncioCTROmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnuncioCTRInclude<ExtArgs> | null
    /**
     * Filter, which AnuncioCTR to fetch.
     */
    where?: AnuncioCTRWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnuncioCTRS to fetch.
     */
    orderBy?: AnuncioCTROrderByWithRelationInput | AnuncioCTROrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnuncioCTRS.
     */
    cursor?: AnuncioCTRWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnuncioCTRS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnuncioCTRS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnuncioCTRS.
     */
    distinct?: AnuncioCTRScalarFieldEnum | AnuncioCTRScalarFieldEnum[]
  }

  /**
   * AnuncioCTR findFirstOrThrow
   */
  export type AnuncioCTRFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnuncioCTR
     */
    select?: AnuncioCTRSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnuncioCTR
     */
    omit?: AnuncioCTROmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnuncioCTRInclude<ExtArgs> | null
    /**
     * Filter, which AnuncioCTR to fetch.
     */
    where?: AnuncioCTRWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnuncioCTRS to fetch.
     */
    orderBy?: AnuncioCTROrderByWithRelationInput | AnuncioCTROrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnuncioCTRS.
     */
    cursor?: AnuncioCTRWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnuncioCTRS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnuncioCTRS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnuncioCTRS.
     */
    distinct?: AnuncioCTRScalarFieldEnum | AnuncioCTRScalarFieldEnum[]
  }

  /**
   * AnuncioCTR findMany
   */
  export type AnuncioCTRFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnuncioCTR
     */
    select?: AnuncioCTRSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnuncioCTR
     */
    omit?: AnuncioCTROmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnuncioCTRInclude<ExtArgs> | null
    /**
     * Filter, which AnuncioCTRS to fetch.
     */
    where?: AnuncioCTRWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnuncioCTRS to fetch.
     */
    orderBy?: AnuncioCTROrderByWithRelationInput | AnuncioCTROrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AnuncioCTRS.
     */
    cursor?: AnuncioCTRWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnuncioCTRS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnuncioCTRS.
     */
    skip?: number
    distinct?: AnuncioCTRScalarFieldEnum | AnuncioCTRScalarFieldEnum[]
  }

  /**
   * AnuncioCTR create
   */
  export type AnuncioCTRCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnuncioCTR
     */
    select?: AnuncioCTRSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnuncioCTR
     */
    omit?: AnuncioCTROmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnuncioCTRInclude<ExtArgs> | null
    /**
     * The data needed to create a AnuncioCTR.
     */
    data: XOR<AnuncioCTRCreateInput, AnuncioCTRUncheckedCreateInput>
  }

  /**
   * AnuncioCTR createMany
   */
  export type AnuncioCTRCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AnuncioCTRS.
     */
    data: AnuncioCTRCreateManyInput | AnuncioCTRCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AnuncioCTR createManyAndReturn
   */
  export type AnuncioCTRCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnuncioCTR
     */
    select?: AnuncioCTRSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AnuncioCTR
     */
    omit?: AnuncioCTROmit<ExtArgs> | null
    /**
     * The data used to create many AnuncioCTRS.
     */
    data: AnuncioCTRCreateManyInput | AnuncioCTRCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnuncioCTRIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AnuncioCTR update
   */
  export type AnuncioCTRUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnuncioCTR
     */
    select?: AnuncioCTRSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnuncioCTR
     */
    omit?: AnuncioCTROmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnuncioCTRInclude<ExtArgs> | null
    /**
     * The data needed to update a AnuncioCTR.
     */
    data: XOR<AnuncioCTRUpdateInput, AnuncioCTRUncheckedUpdateInput>
    /**
     * Choose, which AnuncioCTR to update.
     */
    where: AnuncioCTRWhereUniqueInput
  }

  /**
   * AnuncioCTR updateMany
   */
  export type AnuncioCTRUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AnuncioCTRS.
     */
    data: XOR<AnuncioCTRUpdateManyMutationInput, AnuncioCTRUncheckedUpdateManyInput>
    /**
     * Filter which AnuncioCTRS to update
     */
    where?: AnuncioCTRWhereInput
    /**
     * Limit how many AnuncioCTRS to update.
     */
    limit?: number
  }

  /**
   * AnuncioCTR updateManyAndReturn
   */
  export type AnuncioCTRUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnuncioCTR
     */
    select?: AnuncioCTRSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AnuncioCTR
     */
    omit?: AnuncioCTROmit<ExtArgs> | null
    /**
     * The data used to update AnuncioCTRS.
     */
    data: XOR<AnuncioCTRUpdateManyMutationInput, AnuncioCTRUncheckedUpdateManyInput>
    /**
     * Filter which AnuncioCTRS to update
     */
    where?: AnuncioCTRWhereInput
    /**
     * Limit how many AnuncioCTRS to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnuncioCTRIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AnuncioCTR upsert
   */
  export type AnuncioCTRUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnuncioCTR
     */
    select?: AnuncioCTRSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnuncioCTR
     */
    omit?: AnuncioCTROmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnuncioCTRInclude<ExtArgs> | null
    /**
     * The filter to search for the AnuncioCTR to update in case it exists.
     */
    where: AnuncioCTRWhereUniqueInput
    /**
     * In case the AnuncioCTR found by the `where` argument doesn't exist, create a new AnuncioCTR with this data.
     */
    create: XOR<AnuncioCTRCreateInput, AnuncioCTRUncheckedCreateInput>
    /**
     * In case the AnuncioCTR was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AnuncioCTRUpdateInput, AnuncioCTRUncheckedUpdateInput>
  }

  /**
   * AnuncioCTR delete
   */
  export type AnuncioCTRDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnuncioCTR
     */
    select?: AnuncioCTRSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnuncioCTR
     */
    omit?: AnuncioCTROmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnuncioCTRInclude<ExtArgs> | null
    /**
     * Filter which AnuncioCTR to delete.
     */
    where: AnuncioCTRWhereUniqueInput
  }

  /**
   * AnuncioCTR deleteMany
   */
  export type AnuncioCTRDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnuncioCTRS to delete
     */
    where?: AnuncioCTRWhereInput
    /**
     * Limit how many AnuncioCTRS to delete.
     */
    limit?: number
  }

  /**
   * AnuncioCTR without action
   */
  export type AnuncioCTRDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnuncioCTR
     */
    select?: AnuncioCTRSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnuncioCTR
     */
    omit?: AnuncioCTROmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnuncioCTRInclude<ExtArgs> | null
  }


  /**
   * Model AnuncioConversao
   */

  export type AggregateAnuncioConversao = {
    _count: AnuncioConversaoCountAggregateOutputType | null
    _avg: AnuncioConversaoAvgAggregateOutputType | null
    _sum: AnuncioConversaoSumAggregateOutputType | null
    _min: AnuncioConversaoMinAggregateOutputType | null
    _max: AnuncioConversaoMaxAggregateOutputType | null
  }

  export type AnuncioConversaoAvgAggregateOutputType = {
    conversoes: number | null
  }

  export type AnuncioConversaoSumAggregateOutputType = {
    conversoes: number | null
  }

  export type AnuncioConversaoMinAggregateOutputType = {
    id: string | null
    dashboardId: string | null
    nome: string | null
    conversoes: number | null
  }

  export type AnuncioConversaoMaxAggregateOutputType = {
    id: string | null
    dashboardId: string | null
    nome: string | null
    conversoes: number | null
  }

  export type AnuncioConversaoCountAggregateOutputType = {
    id: number
    dashboardId: number
    nome: number
    conversoes: number
    _all: number
  }


  export type AnuncioConversaoAvgAggregateInputType = {
    conversoes?: true
  }

  export type AnuncioConversaoSumAggregateInputType = {
    conversoes?: true
  }

  export type AnuncioConversaoMinAggregateInputType = {
    id?: true
    dashboardId?: true
    nome?: true
    conversoes?: true
  }

  export type AnuncioConversaoMaxAggregateInputType = {
    id?: true
    dashboardId?: true
    nome?: true
    conversoes?: true
  }

  export type AnuncioConversaoCountAggregateInputType = {
    id?: true
    dashboardId?: true
    nome?: true
    conversoes?: true
    _all?: true
  }

  export type AnuncioConversaoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnuncioConversao to aggregate.
     */
    where?: AnuncioConversaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnuncioConversaos to fetch.
     */
    orderBy?: AnuncioConversaoOrderByWithRelationInput | AnuncioConversaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AnuncioConversaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnuncioConversaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnuncioConversaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AnuncioConversaos
    **/
    _count?: true | AnuncioConversaoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AnuncioConversaoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AnuncioConversaoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AnuncioConversaoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AnuncioConversaoMaxAggregateInputType
  }

  export type GetAnuncioConversaoAggregateType<T extends AnuncioConversaoAggregateArgs> = {
        [P in keyof T & keyof AggregateAnuncioConversao]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAnuncioConversao[P]>
      : GetScalarType<T[P], AggregateAnuncioConversao[P]>
  }




  export type AnuncioConversaoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnuncioConversaoWhereInput
    orderBy?: AnuncioConversaoOrderByWithAggregationInput | AnuncioConversaoOrderByWithAggregationInput[]
    by: AnuncioConversaoScalarFieldEnum[] | AnuncioConversaoScalarFieldEnum
    having?: AnuncioConversaoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AnuncioConversaoCountAggregateInputType | true
    _avg?: AnuncioConversaoAvgAggregateInputType
    _sum?: AnuncioConversaoSumAggregateInputType
    _min?: AnuncioConversaoMinAggregateInputType
    _max?: AnuncioConversaoMaxAggregateInputType
  }

  export type AnuncioConversaoGroupByOutputType = {
    id: string
    dashboardId: string
    nome: string
    conversoes: number
    _count: AnuncioConversaoCountAggregateOutputType | null
    _avg: AnuncioConversaoAvgAggregateOutputType | null
    _sum: AnuncioConversaoSumAggregateOutputType | null
    _min: AnuncioConversaoMinAggregateOutputType | null
    _max: AnuncioConversaoMaxAggregateOutputType | null
  }

  type GetAnuncioConversaoGroupByPayload<T extends AnuncioConversaoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AnuncioConversaoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AnuncioConversaoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AnuncioConversaoGroupByOutputType[P]>
            : GetScalarType<T[P], AnuncioConversaoGroupByOutputType[P]>
        }
      >
    >


  export type AnuncioConversaoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dashboardId?: boolean
    nome?: boolean
    conversoes?: boolean
    dashboard?: boolean | DashboardMarketingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["anuncioConversao"]>

  export type AnuncioConversaoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dashboardId?: boolean
    nome?: boolean
    conversoes?: boolean
    dashboard?: boolean | DashboardMarketingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["anuncioConversao"]>

  export type AnuncioConversaoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dashboardId?: boolean
    nome?: boolean
    conversoes?: boolean
    dashboard?: boolean | DashboardMarketingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["anuncioConversao"]>

  export type AnuncioConversaoSelectScalar = {
    id?: boolean
    dashboardId?: boolean
    nome?: boolean
    conversoes?: boolean
  }

  export type AnuncioConversaoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "dashboardId" | "nome" | "conversoes", ExtArgs["result"]["anuncioConversao"]>
  export type AnuncioConversaoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dashboard?: boolean | DashboardMarketingDefaultArgs<ExtArgs>
  }
  export type AnuncioConversaoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dashboard?: boolean | DashboardMarketingDefaultArgs<ExtArgs>
  }
  export type AnuncioConversaoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dashboard?: boolean | DashboardMarketingDefaultArgs<ExtArgs>
  }

  export type $AnuncioConversaoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AnuncioConversao"
    objects: {
      dashboard: Prisma.$DashboardMarketingPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      dashboardId: string
      nome: string
      conversoes: number
    }, ExtArgs["result"]["anuncioConversao"]>
    composites: {}
  }

  type AnuncioConversaoGetPayload<S extends boolean | null | undefined | AnuncioConversaoDefaultArgs> = $Result.GetResult<Prisma.$AnuncioConversaoPayload, S>

  type AnuncioConversaoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AnuncioConversaoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AnuncioConversaoCountAggregateInputType | true
    }

  export interface AnuncioConversaoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AnuncioConversao'], meta: { name: 'AnuncioConversao' } }
    /**
     * Find zero or one AnuncioConversao that matches the filter.
     * @param {AnuncioConversaoFindUniqueArgs} args - Arguments to find a AnuncioConversao
     * @example
     * // Get one AnuncioConversao
     * const anuncioConversao = await prisma.anuncioConversao.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AnuncioConversaoFindUniqueArgs>(args: SelectSubset<T, AnuncioConversaoFindUniqueArgs<ExtArgs>>): Prisma__AnuncioConversaoClient<$Result.GetResult<Prisma.$AnuncioConversaoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AnuncioConversao that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AnuncioConversaoFindUniqueOrThrowArgs} args - Arguments to find a AnuncioConversao
     * @example
     * // Get one AnuncioConversao
     * const anuncioConversao = await prisma.anuncioConversao.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AnuncioConversaoFindUniqueOrThrowArgs>(args: SelectSubset<T, AnuncioConversaoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AnuncioConversaoClient<$Result.GetResult<Prisma.$AnuncioConversaoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AnuncioConversao that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnuncioConversaoFindFirstArgs} args - Arguments to find a AnuncioConversao
     * @example
     * // Get one AnuncioConversao
     * const anuncioConversao = await prisma.anuncioConversao.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AnuncioConversaoFindFirstArgs>(args?: SelectSubset<T, AnuncioConversaoFindFirstArgs<ExtArgs>>): Prisma__AnuncioConversaoClient<$Result.GetResult<Prisma.$AnuncioConversaoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AnuncioConversao that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnuncioConversaoFindFirstOrThrowArgs} args - Arguments to find a AnuncioConversao
     * @example
     * // Get one AnuncioConversao
     * const anuncioConversao = await prisma.anuncioConversao.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AnuncioConversaoFindFirstOrThrowArgs>(args?: SelectSubset<T, AnuncioConversaoFindFirstOrThrowArgs<ExtArgs>>): Prisma__AnuncioConversaoClient<$Result.GetResult<Prisma.$AnuncioConversaoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AnuncioConversaos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnuncioConversaoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AnuncioConversaos
     * const anuncioConversaos = await prisma.anuncioConversao.findMany()
     * 
     * // Get first 10 AnuncioConversaos
     * const anuncioConversaos = await prisma.anuncioConversao.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const anuncioConversaoWithIdOnly = await prisma.anuncioConversao.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AnuncioConversaoFindManyArgs>(args?: SelectSubset<T, AnuncioConversaoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnuncioConversaoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AnuncioConversao.
     * @param {AnuncioConversaoCreateArgs} args - Arguments to create a AnuncioConversao.
     * @example
     * // Create one AnuncioConversao
     * const AnuncioConversao = await prisma.anuncioConversao.create({
     *   data: {
     *     // ... data to create a AnuncioConversao
     *   }
     * })
     * 
     */
    create<T extends AnuncioConversaoCreateArgs>(args: SelectSubset<T, AnuncioConversaoCreateArgs<ExtArgs>>): Prisma__AnuncioConversaoClient<$Result.GetResult<Prisma.$AnuncioConversaoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AnuncioConversaos.
     * @param {AnuncioConversaoCreateManyArgs} args - Arguments to create many AnuncioConversaos.
     * @example
     * // Create many AnuncioConversaos
     * const anuncioConversao = await prisma.anuncioConversao.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AnuncioConversaoCreateManyArgs>(args?: SelectSubset<T, AnuncioConversaoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AnuncioConversaos and returns the data saved in the database.
     * @param {AnuncioConversaoCreateManyAndReturnArgs} args - Arguments to create many AnuncioConversaos.
     * @example
     * // Create many AnuncioConversaos
     * const anuncioConversao = await prisma.anuncioConversao.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AnuncioConversaos and only return the `id`
     * const anuncioConversaoWithIdOnly = await prisma.anuncioConversao.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AnuncioConversaoCreateManyAndReturnArgs>(args?: SelectSubset<T, AnuncioConversaoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnuncioConversaoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AnuncioConversao.
     * @param {AnuncioConversaoDeleteArgs} args - Arguments to delete one AnuncioConversao.
     * @example
     * // Delete one AnuncioConversao
     * const AnuncioConversao = await prisma.anuncioConversao.delete({
     *   where: {
     *     // ... filter to delete one AnuncioConversao
     *   }
     * })
     * 
     */
    delete<T extends AnuncioConversaoDeleteArgs>(args: SelectSubset<T, AnuncioConversaoDeleteArgs<ExtArgs>>): Prisma__AnuncioConversaoClient<$Result.GetResult<Prisma.$AnuncioConversaoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AnuncioConversao.
     * @param {AnuncioConversaoUpdateArgs} args - Arguments to update one AnuncioConversao.
     * @example
     * // Update one AnuncioConversao
     * const anuncioConversao = await prisma.anuncioConversao.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AnuncioConversaoUpdateArgs>(args: SelectSubset<T, AnuncioConversaoUpdateArgs<ExtArgs>>): Prisma__AnuncioConversaoClient<$Result.GetResult<Prisma.$AnuncioConversaoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AnuncioConversaos.
     * @param {AnuncioConversaoDeleteManyArgs} args - Arguments to filter AnuncioConversaos to delete.
     * @example
     * // Delete a few AnuncioConversaos
     * const { count } = await prisma.anuncioConversao.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AnuncioConversaoDeleteManyArgs>(args?: SelectSubset<T, AnuncioConversaoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AnuncioConversaos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnuncioConversaoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AnuncioConversaos
     * const anuncioConversao = await prisma.anuncioConversao.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AnuncioConversaoUpdateManyArgs>(args: SelectSubset<T, AnuncioConversaoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AnuncioConversaos and returns the data updated in the database.
     * @param {AnuncioConversaoUpdateManyAndReturnArgs} args - Arguments to update many AnuncioConversaos.
     * @example
     * // Update many AnuncioConversaos
     * const anuncioConversao = await prisma.anuncioConversao.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AnuncioConversaos and only return the `id`
     * const anuncioConversaoWithIdOnly = await prisma.anuncioConversao.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AnuncioConversaoUpdateManyAndReturnArgs>(args: SelectSubset<T, AnuncioConversaoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnuncioConversaoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AnuncioConversao.
     * @param {AnuncioConversaoUpsertArgs} args - Arguments to update or create a AnuncioConversao.
     * @example
     * // Update or create a AnuncioConversao
     * const anuncioConversao = await prisma.anuncioConversao.upsert({
     *   create: {
     *     // ... data to create a AnuncioConversao
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AnuncioConversao we want to update
     *   }
     * })
     */
    upsert<T extends AnuncioConversaoUpsertArgs>(args: SelectSubset<T, AnuncioConversaoUpsertArgs<ExtArgs>>): Prisma__AnuncioConversaoClient<$Result.GetResult<Prisma.$AnuncioConversaoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AnuncioConversaos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnuncioConversaoCountArgs} args - Arguments to filter AnuncioConversaos to count.
     * @example
     * // Count the number of AnuncioConversaos
     * const count = await prisma.anuncioConversao.count({
     *   where: {
     *     // ... the filter for the AnuncioConversaos we want to count
     *   }
     * })
    **/
    count<T extends AnuncioConversaoCountArgs>(
      args?: Subset<T, AnuncioConversaoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AnuncioConversaoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AnuncioConversao.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnuncioConversaoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AnuncioConversaoAggregateArgs>(args: Subset<T, AnuncioConversaoAggregateArgs>): Prisma.PrismaPromise<GetAnuncioConversaoAggregateType<T>>

    /**
     * Group by AnuncioConversao.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnuncioConversaoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AnuncioConversaoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AnuncioConversaoGroupByArgs['orderBy'] }
        : { orderBy?: AnuncioConversaoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AnuncioConversaoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAnuncioConversaoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AnuncioConversao model
   */
  readonly fields: AnuncioConversaoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AnuncioConversao.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AnuncioConversaoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    dashboard<T extends DashboardMarketingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DashboardMarketingDefaultArgs<ExtArgs>>): Prisma__DashboardMarketingClient<$Result.GetResult<Prisma.$DashboardMarketingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AnuncioConversao model
   */
  interface AnuncioConversaoFieldRefs {
    readonly id: FieldRef<"AnuncioConversao", 'String'>
    readonly dashboardId: FieldRef<"AnuncioConversao", 'String'>
    readonly nome: FieldRef<"AnuncioConversao", 'String'>
    readonly conversoes: FieldRef<"AnuncioConversao", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * AnuncioConversao findUnique
   */
  export type AnuncioConversaoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnuncioConversao
     */
    select?: AnuncioConversaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnuncioConversao
     */
    omit?: AnuncioConversaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnuncioConversaoInclude<ExtArgs> | null
    /**
     * Filter, which AnuncioConversao to fetch.
     */
    where: AnuncioConversaoWhereUniqueInput
  }

  /**
   * AnuncioConversao findUniqueOrThrow
   */
  export type AnuncioConversaoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnuncioConversao
     */
    select?: AnuncioConversaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnuncioConversao
     */
    omit?: AnuncioConversaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnuncioConversaoInclude<ExtArgs> | null
    /**
     * Filter, which AnuncioConversao to fetch.
     */
    where: AnuncioConversaoWhereUniqueInput
  }

  /**
   * AnuncioConversao findFirst
   */
  export type AnuncioConversaoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnuncioConversao
     */
    select?: AnuncioConversaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnuncioConversao
     */
    omit?: AnuncioConversaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnuncioConversaoInclude<ExtArgs> | null
    /**
     * Filter, which AnuncioConversao to fetch.
     */
    where?: AnuncioConversaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnuncioConversaos to fetch.
     */
    orderBy?: AnuncioConversaoOrderByWithRelationInput | AnuncioConversaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnuncioConversaos.
     */
    cursor?: AnuncioConversaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnuncioConversaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnuncioConversaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnuncioConversaos.
     */
    distinct?: AnuncioConversaoScalarFieldEnum | AnuncioConversaoScalarFieldEnum[]
  }

  /**
   * AnuncioConversao findFirstOrThrow
   */
  export type AnuncioConversaoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnuncioConversao
     */
    select?: AnuncioConversaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnuncioConversao
     */
    omit?: AnuncioConversaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnuncioConversaoInclude<ExtArgs> | null
    /**
     * Filter, which AnuncioConversao to fetch.
     */
    where?: AnuncioConversaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnuncioConversaos to fetch.
     */
    orderBy?: AnuncioConversaoOrderByWithRelationInput | AnuncioConversaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnuncioConversaos.
     */
    cursor?: AnuncioConversaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnuncioConversaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnuncioConversaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnuncioConversaos.
     */
    distinct?: AnuncioConversaoScalarFieldEnum | AnuncioConversaoScalarFieldEnum[]
  }

  /**
   * AnuncioConversao findMany
   */
  export type AnuncioConversaoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnuncioConversao
     */
    select?: AnuncioConversaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnuncioConversao
     */
    omit?: AnuncioConversaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnuncioConversaoInclude<ExtArgs> | null
    /**
     * Filter, which AnuncioConversaos to fetch.
     */
    where?: AnuncioConversaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnuncioConversaos to fetch.
     */
    orderBy?: AnuncioConversaoOrderByWithRelationInput | AnuncioConversaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AnuncioConversaos.
     */
    cursor?: AnuncioConversaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnuncioConversaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnuncioConversaos.
     */
    skip?: number
    distinct?: AnuncioConversaoScalarFieldEnum | AnuncioConversaoScalarFieldEnum[]
  }

  /**
   * AnuncioConversao create
   */
  export type AnuncioConversaoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnuncioConversao
     */
    select?: AnuncioConversaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnuncioConversao
     */
    omit?: AnuncioConversaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnuncioConversaoInclude<ExtArgs> | null
    /**
     * The data needed to create a AnuncioConversao.
     */
    data: XOR<AnuncioConversaoCreateInput, AnuncioConversaoUncheckedCreateInput>
  }

  /**
   * AnuncioConversao createMany
   */
  export type AnuncioConversaoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AnuncioConversaos.
     */
    data: AnuncioConversaoCreateManyInput | AnuncioConversaoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AnuncioConversao createManyAndReturn
   */
  export type AnuncioConversaoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnuncioConversao
     */
    select?: AnuncioConversaoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AnuncioConversao
     */
    omit?: AnuncioConversaoOmit<ExtArgs> | null
    /**
     * The data used to create many AnuncioConversaos.
     */
    data: AnuncioConversaoCreateManyInput | AnuncioConversaoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnuncioConversaoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AnuncioConversao update
   */
  export type AnuncioConversaoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnuncioConversao
     */
    select?: AnuncioConversaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnuncioConversao
     */
    omit?: AnuncioConversaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnuncioConversaoInclude<ExtArgs> | null
    /**
     * The data needed to update a AnuncioConversao.
     */
    data: XOR<AnuncioConversaoUpdateInput, AnuncioConversaoUncheckedUpdateInput>
    /**
     * Choose, which AnuncioConversao to update.
     */
    where: AnuncioConversaoWhereUniqueInput
  }

  /**
   * AnuncioConversao updateMany
   */
  export type AnuncioConversaoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AnuncioConversaos.
     */
    data: XOR<AnuncioConversaoUpdateManyMutationInput, AnuncioConversaoUncheckedUpdateManyInput>
    /**
     * Filter which AnuncioConversaos to update
     */
    where?: AnuncioConversaoWhereInput
    /**
     * Limit how many AnuncioConversaos to update.
     */
    limit?: number
  }

  /**
   * AnuncioConversao updateManyAndReturn
   */
  export type AnuncioConversaoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnuncioConversao
     */
    select?: AnuncioConversaoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AnuncioConversao
     */
    omit?: AnuncioConversaoOmit<ExtArgs> | null
    /**
     * The data used to update AnuncioConversaos.
     */
    data: XOR<AnuncioConversaoUpdateManyMutationInput, AnuncioConversaoUncheckedUpdateManyInput>
    /**
     * Filter which AnuncioConversaos to update
     */
    where?: AnuncioConversaoWhereInput
    /**
     * Limit how many AnuncioConversaos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnuncioConversaoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AnuncioConversao upsert
   */
  export type AnuncioConversaoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnuncioConversao
     */
    select?: AnuncioConversaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnuncioConversao
     */
    omit?: AnuncioConversaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnuncioConversaoInclude<ExtArgs> | null
    /**
     * The filter to search for the AnuncioConversao to update in case it exists.
     */
    where: AnuncioConversaoWhereUniqueInput
    /**
     * In case the AnuncioConversao found by the `where` argument doesn't exist, create a new AnuncioConversao with this data.
     */
    create: XOR<AnuncioConversaoCreateInput, AnuncioConversaoUncheckedCreateInput>
    /**
     * In case the AnuncioConversao was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AnuncioConversaoUpdateInput, AnuncioConversaoUncheckedUpdateInput>
  }

  /**
   * AnuncioConversao delete
   */
  export type AnuncioConversaoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnuncioConversao
     */
    select?: AnuncioConversaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnuncioConversao
     */
    omit?: AnuncioConversaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnuncioConversaoInclude<ExtArgs> | null
    /**
     * Filter which AnuncioConversao to delete.
     */
    where: AnuncioConversaoWhereUniqueInput
  }

  /**
   * AnuncioConversao deleteMany
   */
  export type AnuncioConversaoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnuncioConversaos to delete
     */
    where?: AnuncioConversaoWhereInput
    /**
     * Limit how many AnuncioConversaos to delete.
     */
    limit?: number
  }

  /**
   * AnuncioConversao without action
   */
  export type AnuncioConversaoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnuncioConversao
     */
    select?: AnuncioConversaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnuncioConversao
     */
    omit?: AnuncioConversaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnuncioConversaoInclude<ExtArgs> | null
  }


  /**
   * Model PalavraChave
   */

  export type AggregatePalavraChave = {
    _count: PalavraChaveCountAggregateOutputType | null
    _avg: PalavraChaveAvgAggregateOutputType | null
    _sum: PalavraChaveSumAggregateOutputType | null
    _min: PalavraChaveMinAggregateOutputType | null
    _max: PalavraChaveMaxAggregateOutputType | null
  }

  export type PalavraChaveAvgAggregateOutputType = {
    ctr: number | null
  }

  export type PalavraChaveSumAggregateOutputType = {
    ctr: number | null
  }

  export type PalavraChaveMinAggregateOutputType = {
    id: string | null
    dashboardId: string | null
    palavra: string | null
    ctr: number | null
  }

  export type PalavraChaveMaxAggregateOutputType = {
    id: string | null
    dashboardId: string | null
    palavra: string | null
    ctr: number | null
  }

  export type PalavraChaveCountAggregateOutputType = {
    id: number
    dashboardId: number
    palavra: number
    ctr: number
    _all: number
  }


  export type PalavraChaveAvgAggregateInputType = {
    ctr?: true
  }

  export type PalavraChaveSumAggregateInputType = {
    ctr?: true
  }

  export type PalavraChaveMinAggregateInputType = {
    id?: true
    dashboardId?: true
    palavra?: true
    ctr?: true
  }

  export type PalavraChaveMaxAggregateInputType = {
    id?: true
    dashboardId?: true
    palavra?: true
    ctr?: true
  }

  export type PalavraChaveCountAggregateInputType = {
    id?: true
    dashboardId?: true
    palavra?: true
    ctr?: true
    _all?: true
  }

  export type PalavraChaveAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PalavraChave to aggregate.
     */
    where?: PalavraChaveWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PalavraChaves to fetch.
     */
    orderBy?: PalavraChaveOrderByWithRelationInput | PalavraChaveOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PalavraChaveWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PalavraChaves from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PalavraChaves.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PalavraChaves
    **/
    _count?: true | PalavraChaveCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PalavraChaveAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PalavraChaveSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PalavraChaveMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PalavraChaveMaxAggregateInputType
  }

  export type GetPalavraChaveAggregateType<T extends PalavraChaveAggregateArgs> = {
        [P in keyof T & keyof AggregatePalavraChave]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePalavraChave[P]>
      : GetScalarType<T[P], AggregatePalavraChave[P]>
  }




  export type PalavraChaveGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PalavraChaveWhereInput
    orderBy?: PalavraChaveOrderByWithAggregationInput | PalavraChaveOrderByWithAggregationInput[]
    by: PalavraChaveScalarFieldEnum[] | PalavraChaveScalarFieldEnum
    having?: PalavraChaveScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PalavraChaveCountAggregateInputType | true
    _avg?: PalavraChaveAvgAggregateInputType
    _sum?: PalavraChaveSumAggregateInputType
    _min?: PalavraChaveMinAggregateInputType
    _max?: PalavraChaveMaxAggregateInputType
  }

  export type PalavraChaveGroupByOutputType = {
    id: string
    dashboardId: string
    palavra: string
    ctr: number
    _count: PalavraChaveCountAggregateOutputType | null
    _avg: PalavraChaveAvgAggregateOutputType | null
    _sum: PalavraChaveSumAggregateOutputType | null
    _min: PalavraChaveMinAggregateOutputType | null
    _max: PalavraChaveMaxAggregateOutputType | null
  }

  type GetPalavraChaveGroupByPayload<T extends PalavraChaveGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PalavraChaveGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PalavraChaveGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PalavraChaveGroupByOutputType[P]>
            : GetScalarType<T[P], PalavraChaveGroupByOutputType[P]>
        }
      >
    >


  export type PalavraChaveSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dashboardId?: boolean
    palavra?: boolean
    ctr?: boolean
    dashboard?: boolean | DashboardMarketingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["palavraChave"]>

  export type PalavraChaveSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dashboardId?: boolean
    palavra?: boolean
    ctr?: boolean
    dashboard?: boolean | DashboardMarketingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["palavraChave"]>

  export type PalavraChaveSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dashboardId?: boolean
    palavra?: boolean
    ctr?: boolean
    dashboard?: boolean | DashboardMarketingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["palavraChave"]>

  export type PalavraChaveSelectScalar = {
    id?: boolean
    dashboardId?: boolean
    palavra?: boolean
    ctr?: boolean
  }

  export type PalavraChaveOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "dashboardId" | "palavra" | "ctr", ExtArgs["result"]["palavraChave"]>
  export type PalavraChaveInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dashboard?: boolean | DashboardMarketingDefaultArgs<ExtArgs>
  }
  export type PalavraChaveIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dashboard?: boolean | DashboardMarketingDefaultArgs<ExtArgs>
  }
  export type PalavraChaveIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dashboard?: boolean | DashboardMarketingDefaultArgs<ExtArgs>
  }

  export type $PalavraChavePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PalavraChave"
    objects: {
      dashboard: Prisma.$DashboardMarketingPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      dashboardId: string
      palavra: string
      ctr: number
    }, ExtArgs["result"]["palavraChave"]>
    composites: {}
  }

  type PalavraChaveGetPayload<S extends boolean | null | undefined | PalavraChaveDefaultArgs> = $Result.GetResult<Prisma.$PalavraChavePayload, S>

  type PalavraChaveCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PalavraChaveFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PalavraChaveCountAggregateInputType | true
    }

  export interface PalavraChaveDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PalavraChave'], meta: { name: 'PalavraChave' } }
    /**
     * Find zero or one PalavraChave that matches the filter.
     * @param {PalavraChaveFindUniqueArgs} args - Arguments to find a PalavraChave
     * @example
     * // Get one PalavraChave
     * const palavraChave = await prisma.palavraChave.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PalavraChaveFindUniqueArgs>(args: SelectSubset<T, PalavraChaveFindUniqueArgs<ExtArgs>>): Prisma__PalavraChaveClient<$Result.GetResult<Prisma.$PalavraChavePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PalavraChave that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PalavraChaveFindUniqueOrThrowArgs} args - Arguments to find a PalavraChave
     * @example
     * // Get one PalavraChave
     * const palavraChave = await prisma.palavraChave.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PalavraChaveFindUniqueOrThrowArgs>(args: SelectSubset<T, PalavraChaveFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PalavraChaveClient<$Result.GetResult<Prisma.$PalavraChavePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PalavraChave that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PalavraChaveFindFirstArgs} args - Arguments to find a PalavraChave
     * @example
     * // Get one PalavraChave
     * const palavraChave = await prisma.palavraChave.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PalavraChaveFindFirstArgs>(args?: SelectSubset<T, PalavraChaveFindFirstArgs<ExtArgs>>): Prisma__PalavraChaveClient<$Result.GetResult<Prisma.$PalavraChavePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PalavraChave that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PalavraChaveFindFirstOrThrowArgs} args - Arguments to find a PalavraChave
     * @example
     * // Get one PalavraChave
     * const palavraChave = await prisma.palavraChave.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PalavraChaveFindFirstOrThrowArgs>(args?: SelectSubset<T, PalavraChaveFindFirstOrThrowArgs<ExtArgs>>): Prisma__PalavraChaveClient<$Result.GetResult<Prisma.$PalavraChavePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PalavraChaves that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PalavraChaveFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PalavraChaves
     * const palavraChaves = await prisma.palavraChave.findMany()
     * 
     * // Get first 10 PalavraChaves
     * const palavraChaves = await prisma.palavraChave.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const palavraChaveWithIdOnly = await prisma.palavraChave.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PalavraChaveFindManyArgs>(args?: SelectSubset<T, PalavraChaveFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PalavraChavePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PalavraChave.
     * @param {PalavraChaveCreateArgs} args - Arguments to create a PalavraChave.
     * @example
     * // Create one PalavraChave
     * const PalavraChave = await prisma.palavraChave.create({
     *   data: {
     *     // ... data to create a PalavraChave
     *   }
     * })
     * 
     */
    create<T extends PalavraChaveCreateArgs>(args: SelectSubset<T, PalavraChaveCreateArgs<ExtArgs>>): Prisma__PalavraChaveClient<$Result.GetResult<Prisma.$PalavraChavePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PalavraChaves.
     * @param {PalavraChaveCreateManyArgs} args - Arguments to create many PalavraChaves.
     * @example
     * // Create many PalavraChaves
     * const palavraChave = await prisma.palavraChave.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PalavraChaveCreateManyArgs>(args?: SelectSubset<T, PalavraChaveCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PalavraChaves and returns the data saved in the database.
     * @param {PalavraChaveCreateManyAndReturnArgs} args - Arguments to create many PalavraChaves.
     * @example
     * // Create many PalavraChaves
     * const palavraChave = await prisma.palavraChave.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PalavraChaves and only return the `id`
     * const palavraChaveWithIdOnly = await prisma.palavraChave.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PalavraChaveCreateManyAndReturnArgs>(args?: SelectSubset<T, PalavraChaveCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PalavraChavePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PalavraChave.
     * @param {PalavraChaveDeleteArgs} args - Arguments to delete one PalavraChave.
     * @example
     * // Delete one PalavraChave
     * const PalavraChave = await prisma.palavraChave.delete({
     *   where: {
     *     // ... filter to delete one PalavraChave
     *   }
     * })
     * 
     */
    delete<T extends PalavraChaveDeleteArgs>(args: SelectSubset<T, PalavraChaveDeleteArgs<ExtArgs>>): Prisma__PalavraChaveClient<$Result.GetResult<Prisma.$PalavraChavePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PalavraChave.
     * @param {PalavraChaveUpdateArgs} args - Arguments to update one PalavraChave.
     * @example
     * // Update one PalavraChave
     * const palavraChave = await prisma.palavraChave.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PalavraChaveUpdateArgs>(args: SelectSubset<T, PalavraChaveUpdateArgs<ExtArgs>>): Prisma__PalavraChaveClient<$Result.GetResult<Prisma.$PalavraChavePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PalavraChaves.
     * @param {PalavraChaveDeleteManyArgs} args - Arguments to filter PalavraChaves to delete.
     * @example
     * // Delete a few PalavraChaves
     * const { count } = await prisma.palavraChave.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PalavraChaveDeleteManyArgs>(args?: SelectSubset<T, PalavraChaveDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PalavraChaves.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PalavraChaveUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PalavraChaves
     * const palavraChave = await prisma.palavraChave.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PalavraChaveUpdateManyArgs>(args: SelectSubset<T, PalavraChaveUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PalavraChaves and returns the data updated in the database.
     * @param {PalavraChaveUpdateManyAndReturnArgs} args - Arguments to update many PalavraChaves.
     * @example
     * // Update many PalavraChaves
     * const palavraChave = await prisma.palavraChave.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PalavraChaves and only return the `id`
     * const palavraChaveWithIdOnly = await prisma.palavraChave.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PalavraChaveUpdateManyAndReturnArgs>(args: SelectSubset<T, PalavraChaveUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PalavraChavePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PalavraChave.
     * @param {PalavraChaveUpsertArgs} args - Arguments to update or create a PalavraChave.
     * @example
     * // Update or create a PalavraChave
     * const palavraChave = await prisma.palavraChave.upsert({
     *   create: {
     *     // ... data to create a PalavraChave
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PalavraChave we want to update
     *   }
     * })
     */
    upsert<T extends PalavraChaveUpsertArgs>(args: SelectSubset<T, PalavraChaveUpsertArgs<ExtArgs>>): Prisma__PalavraChaveClient<$Result.GetResult<Prisma.$PalavraChavePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PalavraChaves.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PalavraChaveCountArgs} args - Arguments to filter PalavraChaves to count.
     * @example
     * // Count the number of PalavraChaves
     * const count = await prisma.palavraChave.count({
     *   where: {
     *     // ... the filter for the PalavraChaves we want to count
     *   }
     * })
    **/
    count<T extends PalavraChaveCountArgs>(
      args?: Subset<T, PalavraChaveCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PalavraChaveCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PalavraChave.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PalavraChaveAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PalavraChaveAggregateArgs>(args: Subset<T, PalavraChaveAggregateArgs>): Prisma.PrismaPromise<GetPalavraChaveAggregateType<T>>

    /**
     * Group by PalavraChave.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PalavraChaveGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PalavraChaveGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PalavraChaveGroupByArgs['orderBy'] }
        : { orderBy?: PalavraChaveGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PalavraChaveGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPalavraChaveGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PalavraChave model
   */
  readonly fields: PalavraChaveFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PalavraChave.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PalavraChaveClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    dashboard<T extends DashboardMarketingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DashboardMarketingDefaultArgs<ExtArgs>>): Prisma__DashboardMarketingClient<$Result.GetResult<Prisma.$DashboardMarketingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PalavraChave model
   */
  interface PalavraChaveFieldRefs {
    readonly id: FieldRef<"PalavraChave", 'String'>
    readonly dashboardId: FieldRef<"PalavraChave", 'String'>
    readonly palavra: FieldRef<"PalavraChave", 'String'>
    readonly ctr: FieldRef<"PalavraChave", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * PalavraChave findUnique
   */
  export type PalavraChaveFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PalavraChave
     */
    select?: PalavraChaveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PalavraChave
     */
    omit?: PalavraChaveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PalavraChaveInclude<ExtArgs> | null
    /**
     * Filter, which PalavraChave to fetch.
     */
    where: PalavraChaveWhereUniqueInput
  }

  /**
   * PalavraChave findUniqueOrThrow
   */
  export type PalavraChaveFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PalavraChave
     */
    select?: PalavraChaveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PalavraChave
     */
    omit?: PalavraChaveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PalavraChaveInclude<ExtArgs> | null
    /**
     * Filter, which PalavraChave to fetch.
     */
    where: PalavraChaveWhereUniqueInput
  }

  /**
   * PalavraChave findFirst
   */
  export type PalavraChaveFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PalavraChave
     */
    select?: PalavraChaveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PalavraChave
     */
    omit?: PalavraChaveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PalavraChaveInclude<ExtArgs> | null
    /**
     * Filter, which PalavraChave to fetch.
     */
    where?: PalavraChaveWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PalavraChaves to fetch.
     */
    orderBy?: PalavraChaveOrderByWithRelationInput | PalavraChaveOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PalavraChaves.
     */
    cursor?: PalavraChaveWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PalavraChaves from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PalavraChaves.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PalavraChaves.
     */
    distinct?: PalavraChaveScalarFieldEnum | PalavraChaveScalarFieldEnum[]
  }

  /**
   * PalavraChave findFirstOrThrow
   */
  export type PalavraChaveFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PalavraChave
     */
    select?: PalavraChaveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PalavraChave
     */
    omit?: PalavraChaveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PalavraChaveInclude<ExtArgs> | null
    /**
     * Filter, which PalavraChave to fetch.
     */
    where?: PalavraChaveWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PalavraChaves to fetch.
     */
    orderBy?: PalavraChaveOrderByWithRelationInput | PalavraChaveOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PalavraChaves.
     */
    cursor?: PalavraChaveWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PalavraChaves from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PalavraChaves.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PalavraChaves.
     */
    distinct?: PalavraChaveScalarFieldEnum | PalavraChaveScalarFieldEnum[]
  }

  /**
   * PalavraChave findMany
   */
  export type PalavraChaveFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PalavraChave
     */
    select?: PalavraChaveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PalavraChave
     */
    omit?: PalavraChaveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PalavraChaveInclude<ExtArgs> | null
    /**
     * Filter, which PalavraChaves to fetch.
     */
    where?: PalavraChaveWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PalavraChaves to fetch.
     */
    orderBy?: PalavraChaveOrderByWithRelationInput | PalavraChaveOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PalavraChaves.
     */
    cursor?: PalavraChaveWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PalavraChaves from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PalavraChaves.
     */
    skip?: number
    distinct?: PalavraChaveScalarFieldEnum | PalavraChaveScalarFieldEnum[]
  }

  /**
   * PalavraChave create
   */
  export type PalavraChaveCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PalavraChave
     */
    select?: PalavraChaveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PalavraChave
     */
    omit?: PalavraChaveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PalavraChaveInclude<ExtArgs> | null
    /**
     * The data needed to create a PalavraChave.
     */
    data: XOR<PalavraChaveCreateInput, PalavraChaveUncheckedCreateInput>
  }

  /**
   * PalavraChave createMany
   */
  export type PalavraChaveCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PalavraChaves.
     */
    data: PalavraChaveCreateManyInput | PalavraChaveCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PalavraChave createManyAndReturn
   */
  export type PalavraChaveCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PalavraChave
     */
    select?: PalavraChaveSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PalavraChave
     */
    omit?: PalavraChaveOmit<ExtArgs> | null
    /**
     * The data used to create many PalavraChaves.
     */
    data: PalavraChaveCreateManyInput | PalavraChaveCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PalavraChaveIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PalavraChave update
   */
  export type PalavraChaveUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PalavraChave
     */
    select?: PalavraChaveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PalavraChave
     */
    omit?: PalavraChaveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PalavraChaveInclude<ExtArgs> | null
    /**
     * The data needed to update a PalavraChave.
     */
    data: XOR<PalavraChaveUpdateInput, PalavraChaveUncheckedUpdateInput>
    /**
     * Choose, which PalavraChave to update.
     */
    where: PalavraChaveWhereUniqueInput
  }

  /**
   * PalavraChave updateMany
   */
  export type PalavraChaveUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PalavraChaves.
     */
    data: XOR<PalavraChaveUpdateManyMutationInput, PalavraChaveUncheckedUpdateManyInput>
    /**
     * Filter which PalavraChaves to update
     */
    where?: PalavraChaveWhereInput
    /**
     * Limit how many PalavraChaves to update.
     */
    limit?: number
  }

  /**
   * PalavraChave updateManyAndReturn
   */
  export type PalavraChaveUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PalavraChave
     */
    select?: PalavraChaveSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PalavraChave
     */
    omit?: PalavraChaveOmit<ExtArgs> | null
    /**
     * The data used to update PalavraChaves.
     */
    data: XOR<PalavraChaveUpdateManyMutationInput, PalavraChaveUncheckedUpdateManyInput>
    /**
     * Filter which PalavraChaves to update
     */
    where?: PalavraChaveWhereInput
    /**
     * Limit how many PalavraChaves to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PalavraChaveIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PalavraChave upsert
   */
  export type PalavraChaveUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PalavraChave
     */
    select?: PalavraChaveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PalavraChave
     */
    omit?: PalavraChaveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PalavraChaveInclude<ExtArgs> | null
    /**
     * The filter to search for the PalavraChave to update in case it exists.
     */
    where: PalavraChaveWhereUniqueInput
    /**
     * In case the PalavraChave found by the `where` argument doesn't exist, create a new PalavraChave with this data.
     */
    create: XOR<PalavraChaveCreateInput, PalavraChaveUncheckedCreateInput>
    /**
     * In case the PalavraChave was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PalavraChaveUpdateInput, PalavraChaveUncheckedUpdateInput>
  }

  /**
   * PalavraChave delete
   */
  export type PalavraChaveDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PalavraChave
     */
    select?: PalavraChaveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PalavraChave
     */
    omit?: PalavraChaveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PalavraChaveInclude<ExtArgs> | null
    /**
     * Filter which PalavraChave to delete.
     */
    where: PalavraChaveWhereUniqueInput
  }

  /**
   * PalavraChave deleteMany
   */
  export type PalavraChaveDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PalavraChaves to delete
     */
    where?: PalavraChaveWhereInput
    /**
     * Limit how many PalavraChaves to delete.
     */
    limit?: number
  }

  /**
   * PalavraChave without action
   */
  export type PalavraChaveDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PalavraChave
     */
    select?: PalavraChaveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PalavraChave
     */
    omit?: PalavraChaveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PalavraChaveInclude<ExtArgs> | null
  }


  /**
   * Model DashboardComercial
   */

  export type AggregateDashboardComercial = {
    _count: DashboardComercialCountAggregateOutputType | null
    _avg: DashboardComercialAvgAggregateOutputType | null
    _sum: DashboardComercialSumAggregateOutputType | null
    _min: DashboardComercialMinAggregateOutputType | null
    _max: DashboardComercialMaxAggregateOutputType | null
  }

  export type DashboardComercialAvgAggregateOutputType = {
    receitaTotal: Decimal | null
    ticketMedio: Decimal | null
    crescimentoReceita: number | null
    novosClientes: number | null
    taxaRetencaoClientes: number | null
    clv: Decimal | null
    volumeReparos: number | null
    taxaReincidenciaReparos: number | null
    receitaReparosVsVendas: number | null
  }

  export type DashboardComercialSumAggregateOutputType = {
    receitaTotal: Decimal | null
    ticketMedio: Decimal | null
    crescimentoReceita: number | null
    novosClientes: number | null
    taxaRetencaoClientes: number | null
    clv: Decimal | null
    volumeReparos: number | null
    taxaReincidenciaReparos: number | null
    receitaReparosVsVendas: number | null
  }

  export type DashboardComercialMinAggregateOutputType = {
    id: string | null
    organizationId: string | null
    receitaTotal: Decimal | null
    ticketMedio: Decimal | null
    crescimentoReceita: number | null
    novosClientes: number | null
    taxaRetencaoClientes: number | null
    clv: Decimal | null
    volumeReparos: number | null
    taxaReincidenciaReparos: number | null
    receitaReparosVsVendas: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DashboardComercialMaxAggregateOutputType = {
    id: string | null
    organizationId: string | null
    receitaTotal: Decimal | null
    ticketMedio: Decimal | null
    crescimentoReceita: number | null
    novosClientes: number | null
    taxaRetencaoClientes: number | null
    clv: Decimal | null
    volumeReparos: number | null
    taxaReincidenciaReparos: number | null
    receitaReparosVsVendas: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DashboardComercialCountAggregateOutputType = {
    id: number
    organizationId: number
    receitaTotal: number
    ticketMedio: number
    crescimentoReceita: number
    novosClientes: number
    taxaRetencaoClientes: number
    clv: number
    volumeReparos: number
    taxaReincidenciaReparos: number
    receitaReparosVsVendas: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DashboardComercialAvgAggregateInputType = {
    receitaTotal?: true
    ticketMedio?: true
    crescimentoReceita?: true
    novosClientes?: true
    taxaRetencaoClientes?: true
    clv?: true
    volumeReparos?: true
    taxaReincidenciaReparos?: true
    receitaReparosVsVendas?: true
  }

  export type DashboardComercialSumAggregateInputType = {
    receitaTotal?: true
    ticketMedio?: true
    crescimentoReceita?: true
    novosClientes?: true
    taxaRetencaoClientes?: true
    clv?: true
    volumeReparos?: true
    taxaReincidenciaReparos?: true
    receitaReparosVsVendas?: true
  }

  export type DashboardComercialMinAggregateInputType = {
    id?: true
    organizationId?: true
    receitaTotal?: true
    ticketMedio?: true
    crescimentoReceita?: true
    novosClientes?: true
    taxaRetencaoClientes?: true
    clv?: true
    volumeReparos?: true
    taxaReincidenciaReparos?: true
    receitaReparosVsVendas?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DashboardComercialMaxAggregateInputType = {
    id?: true
    organizationId?: true
    receitaTotal?: true
    ticketMedio?: true
    crescimentoReceita?: true
    novosClientes?: true
    taxaRetencaoClientes?: true
    clv?: true
    volumeReparos?: true
    taxaReincidenciaReparos?: true
    receitaReparosVsVendas?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DashboardComercialCountAggregateInputType = {
    id?: true
    organizationId?: true
    receitaTotal?: true
    ticketMedio?: true
    crescimentoReceita?: true
    novosClientes?: true
    taxaRetencaoClientes?: true
    clv?: true
    volumeReparos?: true
    taxaReincidenciaReparos?: true
    receitaReparosVsVendas?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DashboardComercialAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DashboardComercial to aggregate.
     */
    where?: DashboardComercialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DashboardComercials to fetch.
     */
    orderBy?: DashboardComercialOrderByWithRelationInput | DashboardComercialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DashboardComercialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DashboardComercials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DashboardComercials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DashboardComercials
    **/
    _count?: true | DashboardComercialCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DashboardComercialAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DashboardComercialSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DashboardComercialMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DashboardComercialMaxAggregateInputType
  }

  export type GetDashboardComercialAggregateType<T extends DashboardComercialAggregateArgs> = {
        [P in keyof T & keyof AggregateDashboardComercial]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDashboardComercial[P]>
      : GetScalarType<T[P], AggregateDashboardComercial[P]>
  }




  export type DashboardComercialGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DashboardComercialWhereInput
    orderBy?: DashboardComercialOrderByWithAggregationInput | DashboardComercialOrderByWithAggregationInput[]
    by: DashboardComercialScalarFieldEnum[] | DashboardComercialScalarFieldEnum
    having?: DashboardComercialScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DashboardComercialCountAggregateInputType | true
    _avg?: DashboardComercialAvgAggregateInputType
    _sum?: DashboardComercialSumAggregateInputType
    _min?: DashboardComercialMinAggregateInputType
    _max?: DashboardComercialMaxAggregateInputType
  }

  export type DashboardComercialGroupByOutputType = {
    id: string
    organizationId: string
    receitaTotal: Decimal
    ticketMedio: Decimal
    crescimentoReceita: number
    novosClientes: number
    taxaRetencaoClientes: number
    clv: Decimal
    volumeReparos: number
    taxaReincidenciaReparos: number
    receitaReparosVsVendas: number
    createdAt: Date
    updatedAt: Date
    _count: DashboardComercialCountAggregateOutputType | null
    _avg: DashboardComercialAvgAggregateOutputType | null
    _sum: DashboardComercialSumAggregateOutputType | null
    _min: DashboardComercialMinAggregateOutputType | null
    _max: DashboardComercialMaxAggregateOutputType | null
  }

  type GetDashboardComercialGroupByPayload<T extends DashboardComercialGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DashboardComercialGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DashboardComercialGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DashboardComercialGroupByOutputType[P]>
            : GetScalarType<T[P], DashboardComercialGroupByOutputType[P]>
        }
      >
    >


  export type DashboardComercialSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    receitaTotal?: boolean
    ticketMedio?: boolean
    crescimentoReceita?: boolean
    novosClientes?: boolean
    taxaRetencaoClientes?: boolean
    clv?: boolean
    volumeReparos?: boolean
    taxaReincidenciaReparos?: boolean
    receitaReparosVsVendas?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    clientesComparacao?: boolean | DashboardComercial$clientesComparacaoArgs<ExtArgs>
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    produtosTop?: boolean | DashboardComercial$produtosTopArgs<ExtArgs>
    receitaPorCategoria?: boolean | DashboardComercial$receitaPorCategoriaArgs<ExtArgs>
    receitaPorPagamento?: boolean | DashboardComercial$receitaPorPagamentoArgs<ExtArgs>
    _count?: boolean | DashboardComercialCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dashboardComercial"]>

  export type DashboardComercialSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    receitaTotal?: boolean
    ticketMedio?: boolean
    crescimentoReceita?: boolean
    novosClientes?: boolean
    taxaRetencaoClientes?: boolean
    clv?: boolean
    volumeReparos?: boolean
    taxaReincidenciaReparos?: boolean
    receitaReparosVsVendas?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dashboardComercial"]>

  export type DashboardComercialSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    receitaTotal?: boolean
    ticketMedio?: boolean
    crescimentoReceita?: boolean
    novosClientes?: boolean
    taxaRetencaoClientes?: boolean
    clv?: boolean
    volumeReparos?: boolean
    taxaReincidenciaReparos?: boolean
    receitaReparosVsVendas?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dashboardComercial"]>

  export type DashboardComercialSelectScalar = {
    id?: boolean
    organizationId?: boolean
    receitaTotal?: boolean
    ticketMedio?: boolean
    crescimentoReceita?: boolean
    novosClientes?: boolean
    taxaRetencaoClientes?: boolean
    clv?: boolean
    volumeReparos?: boolean
    taxaReincidenciaReparos?: boolean
    receitaReparosVsVendas?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DashboardComercialOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "organizationId" | "receitaTotal" | "ticketMedio" | "crescimentoReceita" | "novosClientes" | "taxaRetencaoClientes" | "clv" | "volumeReparos" | "taxaReincidenciaReparos" | "receitaReparosVsVendas" | "createdAt" | "updatedAt", ExtArgs["result"]["dashboardComercial"]>
  export type DashboardComercialInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clientesComparacao?: boolean | DashboardComercial$clientesComparacaoArgs<ExtArgs>
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    produtosTop?: boolean | DashboardComercial$produtosTopArgs<ExtArgs>
    receitaPorCategoria?: boolean | DashboardComercial$receitaPorCategoriaArgs<ExtArgs>
    receitaPorPagamento?: boolean | DashboardComercial$receitaPorPagamentoArgs<ExtArgs>
    _count?: boolean | DashboardComercialCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DashboardComercialIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }
  export type DashboardComercialIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }

  export type $DashboardComercialPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DashboardComercial"
    objects: {
      clientesComparacao: Prisma.$ClientesRecorrentesVsUnicosPayload<ExtArgs>[]
      organization: Prisma.$OrganizationPayload<ExtArgs>
      produtosTop: Prisma.$ProdutoRankPayload<ExtArgs>[]
      receitaPorCategoria: Prisma.$ReceitaCategoriaPayload<ExtArgs>[]
      receitaPorPagamento: Prisma.$ReceitaMetodoPagamentoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      organizationId: string
      receitaTotal: Prisma.Decimal
      ticketMedio: Prisma.Decimal
      crescimentoReceita: number
      novosClientes: number
      taxaRetencaoClientes: number
      clv: Prisma.Decimal
      volumeReparos: number
      taxaReincidenciaReparos: number
      receitaReparosVsVendas: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["dashboardComercial"]>
    composites: {}
  }

  type DashboardComercialGetPayload<S extends boolean | null | undefined | DashboardComercialDefaultArgs> = $Result.GetResult<Prisma.$DashboardComercialPayload, S>

  type DashboardComercialCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DashboardComercialFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DashboardComercialCountAggregateInputType | true
    }

  export interface DashboardComercialDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DashboardComercial'], meta: { name: 'DashboardComercial' } }
    /**
     * Find zero or one DashboardComercial that matches the filter.
     * @param {DashboardComercialFindUniqueArgs} args - Arguments to find a DashboardComercial
     * @example
     * // Get one DashboardComercial
     * const dashboardComercial = await prisma.dashboardComercial.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DashboardComercialFindUniqueArgs>(args: SelectSubset<T, DashboardComercialFindUniqueArgs<ExtArgs>>): Prisma__DashboardComercialClient<$Result.GetResult<Prisma.$DashboardComercialPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DashboardComercial that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DashboardComercialFindUniqueOrThrowArgs} args - Arguments to find a DashboardComercial
     * @example
     * // Get one DashboardComercial
     * const dashboardComercial = await prisma.dashboardComercial.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DashboardComercialFindUniqueOrThrowArgs>(args: SelectSubset<T, DashboardComercialFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DashboardComercialClient<$Result.GetResult<Prisma.$DashboardComercialPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DashboardComercial that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DashboardComercialFindFirstArgs} args - Arguments to find a DashboardComercial
     * @example
     * // Get one DashboardComercial
     * const dashboardComercial = await prisma.dashboardComercial.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DashboardComercialFindFirstArgs>(args?: SelectSubset<T, DashboardComercialFindFirstArgs<ExtArgs>>): Prisma__DashboardComercialClient<$Result.GetResult<Prisma.$DashboardComercialPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DashboardComercial that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DashboardComercialFindFirstOrThrowArgs} args - Arguments to find a DashboardComercial
     * @example
     * // Get one DashboardComercial
     * const dashboardComercial = await prisma.dashboardComercial.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DashboardComercialFindFirstOrThrowArgs>(args?: SelectSubset<T, DashboardComercialFindFirstOrThrowArgs<ExtArgs>>): Prisma__DashboardComercialClient<$Result.GetResult<Prisma.$DashboardComercialPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DashboardComercials that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DashboardComercialFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DashboardComercials
     * const dashboardComercials = await prisma.dashboardComercial.findMany()
     * 
     * // Get first 10 DashboardComercials
     * const dashboardComercials = await prisma.dashboardComercial.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dashboardComercialWithIdOnly = await prisma.dashboardComercial.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DashboardComercialFindManyArgs>(args?: SelectSubset<T, DashboardComercialFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DashboardComercialPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DashboardComercial.
     * @param {DashboardComercialCreateArgs} args - Arguments to create a DashboardComercial.
     * @example
     * // Create one DashboardComercial
     * const DashboardComercial = await prisma.dashboardComercial.create({
     *   data: {
     *     // ... data to create a DashboardComercial
     *   }
     * })
     * 
     */
    create<T extends DashboardComercialCreateArgs>(args: SelectSubset<T, DashboardComercialCreateArgs<ExtArgs>>): Prisma__DashboardComercialClient<$Result.GetResult<Prisma.$DashboardComercialPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DashboardComercials.
     * @param {DashboardComercialCreateManyArgs} args - Arguments to create many DashboardComercials.
     * @example
     * // Create many DashboardComercials
     * const dashboardComercial = await prisma.dashboardComercial.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DashboardComercialCreateManyArgs>(args?: SelectSubset<T, DashboardComercialCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DashboardComercials and returns the data saved in the database.
     * @param {DashboardComercialCreateManyAndReturnArgs} args - Arguments to create many DashboardComercials.
     * @example
     * // Create many DashboardComercials
     * const dashboardComercial = await prisma.dashboardComercial.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DashboardComercials and only return the `id`
     * const dashboardComercialWithIdOnly = await prisma.dashboardComercial.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DashboardComercialCreateManyAndReturnArgs>(args?: SelectSubset<T, DashboardComercialCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DashboardComercialPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DashboardComercial.
     * @param {DashboardComercialDeleteArgs} args - Arguments to delete one DashboardComercial.
     * @example
     * // Delete one DashboardComercial
     * const DashboardComercial = await prisma.dashboardComercial.delete({
     *   where: {
     *     // ... filter to delete one DashboardComercial
     *   }
     * })
     * 
     */
    delete<T extends DashboardComercialDeleteArgs>(args: SelectSubset<T, DashboardComercialDeleteArgs<ExtArgs>>): Prisma__DashboardComercialClient<$Result.GetResult<Prisma.$DashboardComercialPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DashboardComercial.
     * @param {DashboardComercialUpdateArgs} args - Arguments to update one DashboardComercial.
     * @example
     * // Update one DashboardComercial
     * const dashboardComercial = await prisma.dashboardComercial.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DashboardComercialUpdateArgs>(args: SelectSubset<T, DashboardComercialUpdateArgs<ExtArgs>>): Prisma__DashboardComercialClient<$Result.GetResult<Prisma.$DashboardComercialPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DashboardComercials.
     * @param {DashboardComercialDeleteManyArgs} args - Arguments to filter DashboardComercials to delete.
     * @example
     * // Delete a few DashboardComercials
     * const { count } = await prisma.dashboardComercial.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DashboardComercialDeleteManyArgs>(args?: SelectSubset<T, DashboardComercialDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DashboardComercials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DashboardComercialUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DashboardComercials
     * const dashboardComercial = await prisma.dashboardComercial.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DashboardComercialUpdateManyArgs>(args: SelectSubset<T, DashboardComercialUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DashboardComercials and returns the data updated in the database.
     * @param {DashboardComercialUpdateManyAndReturnArgs} args - Arguments to update many DashboardComercials.
     * @example
     * // Update many DashboardComercials
     * const dashboardComercial = await prisma.dashboardComercial.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DashboardComercials and only return the `id`
     * const dashboardComercialWithIdOnly = await prisma.dashboardComercial.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DashboardComercialUpdateManyAndReturnArgs>(args: SelectSubset<T, DashboardComercialUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DashboardComercialPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DashboardComercial.
     * @param {DashboardComercialUpsertArgs} args - Arguments to update or create a DashboardComercial.
     * @example
     * // Update or create a DashboardComercial
     * const dashboardComercial = await prisma.dashboardComercial.upsert({
     *   create: {
     *     // ... data to create a DashboardComercial
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DashboardComercial we want to update
     *   }
     * })
     */
    upsert<T extends DashboardComercialUpsertArgs>(args: SelectSubset<T, DashboardComercialUpsertArgs<ExtArgs>>): Prisma__DashboardComercialClient<$Result.GetResult<Prisma.$DashboardComercialPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DashboardComercials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DashboardComercialCountArgs} args - Arguments to filter DashboardComercials to count.
     * @example
     * // Count the number of DashboardComercials
     * const count = await prisma.dashboardComercial.count({
     *   where: {
     *     // ... the filter for the DashboardComercials we want to count
     *   }
     * })
    **/
    count<T extends DashboardComercialCountArgs>(
      args?: Subset<T, DashboardComercialCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DashboardComercialCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DashboardComercial.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DashboardComercialAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DashboardComercialAggregateArgs>(args: Subset<T, DashboardComercialAggregateArgs>): Prisma.PrismaPromise<GetDashboardComercialAggregateType<T>>

    /**
     * Group by DashboardComercial.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DashboardComercialGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DashboardComercialGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DashboardComercialGroupByArgs['orderBy'] }
        : { orderBy?: DashboardComercialGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DashboardComercialGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDashboardComercialGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DashboardComercial model
   */
  readonly fields: DashboardComercialFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DashboardComercial.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DashboardComercialClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    clientesComparacao<T extends DashboardComercial$clientesComparacaoArgs<ExtArgs> = {}>(args?: Subset<T, DashboardComercial$clientesComparacaoArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientesRecorrentesVsUnicosPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    organization<T extends OrganizationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrganizationDefaultArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    produtosTop<T extends DashboardComercial$produtosTopArgs<ExtArgs> = {}>(args?: Subset<T, DashboardComercial$produtosTopArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProdutoRankPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    receitaPorCategoria<T extends DashboardComercial$receitaPorCategoriaArgs<ExtArgs> = {}>(args?: Subset<T, DashboardComercial$receitaPorCategoriaArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReceitaCategoriaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    receitaPorPagamento<T extends DashboardComercial$receitaPorPagamentoArgs<ExtArgs> = {}>(args?: Subset<T, DashboardComercial$receitaPorPagamentoArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReceitaMetodoPagamentoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DashboardComercial model
   */
  interface DashboardComercialFieldRefs {
    readonly id: FieldRef<"DashboardComercial", 'String'>
    readonly organizationId: FieldRef<"DashboardComercial", 'String'>
    readonly receitaTotal: FieldRef<"DashboardComercial", 'Decimal'>
    readonly ticketMedio: FieldRef<"DashboardComercial", 'Decimal'>
    readonly crescimentoReceita: FieldRef<"DashboardComercial", 'Float'>
    readonly novosClientes: FieldRef<"DashboardComercial", 'Int'>
    readonly taxaRetencaoClientes: FieldRef<"DashboardComercial", 'Float'>
    readonly clv: FieldRef<"DashboardComercial", 'Decimal'>
    readonly volumeReparos: FieldRef<"DashboardComercial", 'Int'>
    readonly taxaReincidenciaReparos: FieldRef<"DashboardComercial", 'Float'>
    readonly receitaReparosVsVendas: FieldRef<"DashboardComercial", 'Float'>
    readonly createdAt: FieldRef<"DashboardComercial", 'DateTime'>
    readonly updatedAt: FieldRef<"DashboardComercial", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DashboardComercial findUnique
   */
  export type DashboardComercialFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardComercial
     */
    select?: DashboardComercialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DashboardComercial
     */
    omit?: DashboardComercialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DashboardComercialInclude<ExtArgs> | null
    /**
     * Filter, which DashboardComercial to fetch.
     */
    where: DashboardComercialWhereUniqueInput
  }

  /**
   * DashboardComercial findUniqueOrThrow
   */
  export type DashboardComercialFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardComercial
     */
    select?: DashboardComercialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DashboardComercial
     */
    omit?: DashboardComercialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DashboardComercialInclude<ExtArgs> | null
    /**
     * Filter, which DashboardComercial to fetch.
     */
    where: DashboardComercialWhereUniqueInput
  }

  /**
   * DashboardComercial findFirst
   */
  export type DashboardComercialFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardComercial
     */
    select?: DashboardComercialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DashboardComercial
     */
    omit?: DashboardComercialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DashboardComercialInclude<ExtArgs> | null
    /**
     * Filter, which DashboardComercial to fetch.
     */
    where?: DashboardComercialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DashboardComercials to fetch.
     */
    orderBy?: DashboardComercialOrderByWithRelationInput | DashboardComercialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DashboardComercials.
     */
    cursor?: DashboardComercialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DashboardComercials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DashboardComercials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DashboardComercials.
     */
    distinct?: DashboardComercialScalarFieldEnum | DashboardComercialScalarFieldEnum[]
  }

  /**
   * DashboardComercial findFirstOrThrow
   */
  export type DashboardComercialFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardComercial
     */
    select?: DashboardComercialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DashboardComercial
     */
    omit?: DashboardComercialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DashboardComercialInclude<ExtArgs> | null
    /**
     * Filter, which DashboardComercial to fetch.
     */
    where?: DashboardComercialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DashboardComercials to fetch.
     */
    orderBy?: DashboardComercialOrderByWithRelationInput | DashboardComercialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DashboardComercials.
     */
    cursor?: DashboardComercialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DashboardComercials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DashboardComercials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DashboardComercials.
     */
    distinct?: DashboardComercialScalarFieldEnum | DashboardComercialScalarFieldEnum[]
  }

  /**
   * DashboardComercial findMany
   */
  export type DashboardComercialFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardComercial
     */
    select?: DashboardComercialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DashboardComercial
     */
    omit?: DashboardComercialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DashboardComercialInclude<ExtArgs> | null
    /**
     * Filter, which DashboardComercials to fetch.
     */
    where?: DashboardComercialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DashboardComercials to fetch.
     */
    orderBy?: DashboardComercialOrderByWithRelationInput | DashboardComercialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DashboardComercials.
     */
    cursor?: DashboardComercialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DashboardComercials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DashboardComercials.
     */
    skip?: number
    distinct?: DashboardComercialScalarFieldEnum | DashboardComercialScalarFieldEnum[]
  }

  /**
   * DashboardComercial create
   */
  export type DashboardComercialCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardComercial
     */
    select?: DashboardComercialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DashboardComercial
     */
    omit?: DashboardComercialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DashboardComercialInclude<ExtArgs> | null
    /**
     * The data needed to create a DashboardComercial.
     */
    data: XOR<DashboardComercialCreateInput, DashboardComercialUncheckedCreateInput>
  }

  /**
   * DashboardComercial createMany
   */
  export type DashboardComercialCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DashboardComercials.
     */
    data: DashboardComercialCreateManyInput | DashboardComercialCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DashboardComercial createManyAndReturn
   */
  export type DashboardComercialCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardComercial
     */
    select?: DashboardComercialSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DashboardComercial
     */
    omit?: DashboardComercialOmit<ExtArgs> | null
    /**
     * The data used to create many DashboardComercials.
     */
    data: DashboardComercialCreateManyInput | DashboardComercialCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DashboardComercialIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DashboardComercial update
   */
  export type DashboardComercialUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardComercial
     */
    select?: DashboardComercialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DashboardComercial
     */
    omit?: DashboardComercialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DashboardComercialInclude<ExtArgs> | null
    /**
     * The data needed to update a DashboardComercial.
     */
    data: XOR<DashboardComercialUpdateInput, DashboardComercialUncheckedUpdateInput>
    /**
     * Choose, which DashboardComercial to update.
     */
    where: DashboardComercialWhereUniqueInput
  }

  /**
   * DashboardComercial updateMany
   */
  export type DashboardComercialUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DashboardComercials.
     */
    data: XOR<DashboardComercialUpdateManyMutationInput, DashboardComercialUncheckedUpdateManyInput>
    /**
     * Filter which DashboardComercials to update
     */
    where?: DashboardComercialWhereInput
    /**
     * Limit how many DashboardComercials to update.
     */
    limit?: number
  }

  /**
   * DashboardComercial updateManyAndReturn
   */
  export type DashboardComercialUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardComercial
     */
    select?: DashboardComercialSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DashboardComercial
     */
    omit?: DashboardComercialOmit<ExtArgs> | null
    /**
     * The data used to update DashboardComercials.
     */
    data: XOR<DashboardComercialUpdateManyMutationInput, DashboardComercialUncheckedUpdateManyInput>
    /**
     * Filter which DashboardComercials to update
     */
    where?: DashboardComercialWhereInput
    /**
     * Limit how many DashboardComercials to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DashboardComercialIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DashboardComercial upsert
   */
  export type DashboardComercialUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardComercial
     */
    select?: DashboardComercialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DashboardComercial
     */
    omit?: DashboardComercialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DashboardComercialInclude<ExtArgs> | null
    /**
     * The filter to search for the DashboardComercial to update in case it exists.
     */
    where: DashboardComercialWhereUniqueInput
    /**
     * In case the DashboardComercial found by the `where` argument doesn't exist, create a new DashboardComercial with this data.
     */
    create: XOR<DashboardComercialCreateInput, DashboardComercialUncheckedCreateInput>
    /**
     * In case the DashboardComercial was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DashboardComercialUpdateInput, DashboardComercialUncheckedUpdateInput>
  }

  /**
   * DashboardComercial delete
   */
  export type DashboardComercialDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardComercial
     */
    select?: DashboardComercialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DashboardComercial
     */
    omit?: DashboardComercialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DashboardComercialInclude<ExtArgs> | null
    /**
     * Filter which DashboardComercial to delete.
     */
    where: DashboardComercialWhereUniqueInput
  }

  /**
   * DashboardComercial deleteMany
   */
  export type DashboardComercialDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DashboardComercials to delete
     */
    where?: DashboardComercialWhereInput
    /**
     * Limit how many DashboardComercials to delete.
     */
    limit?: number
  }

  /**
   * DashboardComercial.clientesComparacao
   */
  export type DashboardComercial$clientesComparacaoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientesRecorrentesVsUnicos
     */
    select?: ClientesRecorrentesVsUnicosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClientesRecorrentesVsUnicos
     */
    omit?: ClientesRecorrentesVsUnicosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientesRecorrentesVsUnicosInclude<ExtArgs> | null
    where?: ClientesRecorrentesVsUnicosWhereInput
    orderBy?: ClientesRecorrentesVsUnicosOrderByWithRelationInput | ClientesRecorrentesVsUnicosOrderByWithRelationInput[]
    cursor?: ClientesRecorrentesVsUnicosWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ClientesRecorrentesVsUnicosScalarFieldEnum | ClientesRecorrentesVsUnicosScalarFieldEnum[]
  }

  /**
   * DashboardComercial.produtosTop
   */
  export type DashboardComercial$produtosTopArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProdutoRank
     */
    select?: ProdutoRankSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProdutoRank
     */
    omit?: ProdutoRankOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProdutoRankInclude<ExtArgs> | null
    where?: ProdutoRankWhereInput
    orderBy?: ProdutoRankOrderByWithRelationInput | ProdutoRankOrderByWithRelationInput[]
    cursor?: ProdutoRankWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProdutoRankScalarFieldEnum | ProdutoRankScalarFieldEnum[]
  }

  /**
   * DashboardComercial.receitaPorCategoria
   */
  export type DashboardComercial$receitaPorCategoriaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceitaCategoria
     */
    select?: ReceitaCategoriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReceitaCategoria
     */
    omit?: ReceitaCategoriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceitaCategoriaInclude<ExtArgs> | null
    where?: ReceitaCategoriaWhereInput
    orderBy?: ReceitaCategoriaOrderByWithRelationInput | ReceitaCategoriaOrderByWithRelationInput[]
    cursor?: ReceitaCategoriaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReceitaCategoriaScalarFieldEnum | ReceitaCategoriaScalarFieldEnum[]
  }

  /**
   * DashboardComercial.receitaPorPagamento
   */
  export type DashboardComercial$receitaPorPagamentoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceitaMetodoPagamento
     */
    select?: ReceitaMetodoPagamentoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReceitaMetodoPagamento
     */
    omit?: ReceitaMetodoPagamentoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceitaMetodoPagamentoInclude<ExtArgs> | null
    where?: ReceitaMetodoPagamentoWhereInput
    orderBy?: ReceitaMetodoPagamentoOrderByWithRelationInput | ReceitaMetodoPagamentoOrderByWithRelationInput[]
    cursor?: ReceitaMetodoPagamentoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReceitaMetodoPagamentoScalarFieldEnum | ReceitaMetodoPagamentoScalarFieldEnum[]
  }

  /**
   * DashboardComercial without action
   */
  export type DashboardComercialDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardComercial
     */
    select?: DashboardComercialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DashboardComercial
     */
    omit?: DashboardComercialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DashboardComercialInclude<ExtArgs> | null
  }


  /**
   * Model ReceitaCategoria
   */

  export type AggregateReceitaCategoria = {
    _count: ReceitaCategoriaCountAggregateOutputType | null
    _avg: ReceitaCategoriaAvgAggregateOutputType | null
    _sum: ReceitaCategoriaSumAggregateOutputType | null
    _min: ReceitaCategoriaMinAggregateOutputType | null
    _max: ReceitaCategoriaMaxAggregateOutputType | null
  }

  export type ReceitaCategoriaAvgAggregateOutputType = {
    receita: Decimal | null
  }

  export type ReceitaCategoriaSumAggregateOutputType = {
    receita: Decimal | null
  }

  export type ReceitaCategoriaMinAggregateOutputType = {
    id: string | null
    dashboardId: string | null
    categoria: string | null
    receita: Decimal | null
  }

  export type ReceitaCategoriaMaxAggregateOutputType = {
    id: string | null
    dashboardId: string | null
    categoria: string | null
    receita: Decimal | null
  }

  export type ReceitaCategoriaCountAggregateOutputType = {
    id: number
    dashboardId: number
    categoria: number
    receita: number
    _all: number
  }


  export type ReceitaCategoriaAvgAggregateInputType = {
    receita?: true
  }

  export type ReceitaCategoriaSumAggregateInputType = {
    receita?: true
  }

  export type ReceitaCategoriaMinAggregateInputType = {
    id?: true
    dashboardId?: true
    categoria?: true
    receita?: true
  }

  export type ReceitaCategoriaMaxAggregateInputType = {
    id?: true
    dashboardId?: true
    categoria?: true
    receita?: true
  }

  export type ReceitaCategoriaCountAggregateInputType = {
    id?: true
    dashboardId?: true
    categoria?: true
    receita?: true
    _all?: true
  }

  export type ReceitaCategoriaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReceitaCategoria to aggregate.
     */
    where?: ReceitaCategoriaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReceitaCategorias to fetch.
     */
    orderBy?: ReceitaCategoriaOrderByWithRelationInput | ReceitaCategoriaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReceitaCategoriaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReceitaCategorias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReceitaCategorias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ReceitaCategorias
    **/
    _count?: true | ReceitaCategoriaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReceitaCategoriaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReceitaCategoriaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReceitaCategoriaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReceitaCategoriaMaxAggregateInputType
  }

  export type GetReceitaCategoriaAggregateType<T extends ReceitaCategoriaAggregateArgs> = {
        [P in keyof T & keyof AggregateReceitaCategoria]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReceitaCategoria[P]>
      : GetScalarType<T[P], AggregateReceitaCategoria[P]>
  }




  export type ReceitaCategoriaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReceitaCategoriaWhereInput
    orderBy?: ReceitaCategoriaOrderByWithAggregationInput | ReceitaCategoriaOrderByWithAggregationInput[]
    by: ReceitaCategoriaScalarFieldEnum[] | ReceitaCategoriaScalarFieldEnum
    having?: ReceitaCategoriaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReceitaCategoriaCountAggregateInputType | true
    _avg?: ReceitaCategoriaAvgAggregateInputType
    _sum?: ReceitaCategoriaSumAggregateInputType
    _min?: ReceitaCategoriaMinAggregateInputType
    _max?: ReceitaCategoriaMaxAggregateInputType
  }

  export type ReceitaCategoriaGroupByOutputType = {
    id: string
    dashboardId: string
    categoria: string
    receita: Decimal
    _count: ReceitaCategoriaCountAggregateOutputType | null
    _avg: ReceitaCategoriaAvgAggregateOutputType | null
    _sum: ReceitaCategoriaSumAggregateOutputType | null
    _min: ReceitaCategoriaMinAggregateOutputType | null
    _max: ReceitaCategoriaMaxAggregateOutputType | null
  }

  type GetReceitaCategoriaGroupByPayload<T extends ReceitaCategoriaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReceitaCategoriaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReceitaCategoriaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReceitaCategoriaGroupByOutputType[P]>
            : GetScalarType<T[P], ReceitaCategoriaGroupByOutputType[P]>
        }
      >
    >


  export type ReceitaCategoriaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dashboardId?: boolean
    categoria?: boolean
    receita?: boolean
    dashboard?: boolean | DashboardComercialDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["receitaCategoria"]>

  export type ReceitaCategoriaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dashboardId?: boolean
    categoria?: boolean
    receita?: boolean
    dashboard?: boolean | DashboardComercialDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["receitaCategoria"]>

  export type ReceitaCategoriaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dashboardId?: boolean
    categoria?: boolean
    receita?: boolean
    dashboard?: boolean | DashboardComercialDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["receitaCategoria"]>

  export type ReceitaCategoriaSelectScalar = {
    id?: boolean
    dashboardId?: boolean
    categoria?: boolean
    receita?: boolean
  }

  export type ReceitaCategoriaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "dashboardId" | "categoria" | "receita", ExtArgs["result"]["receitaCategoria"]>
  export type ReceitaCategoriaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dashboard?: boolean | DashboardComercialDefaultArgs<ExtArgs>
  }
  export type ReceitaCategoriaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dashboard?: boolean | DashboardComercialDefaultArgs<ExtArgs>
  }
  export type ReceitaCategoriaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dashboard?: boolean | DashboardComercialDefaultArgs<ExtArgs>
  }

  export type $ReceitaCategoriaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ReceitaCategoria"
    objects: {
      dashboard: Prisma.$DashboardComercialPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      dashboardId: string
      categoria: string
      receita: Prisma.Decimal
    }, ExtArgs["result"]["receitaCategoria"]>
    composites: {}
  }

  type ReceitaCategoriaGetPayload<S extends boolean | null | undefined | ReceitaCategoriaDefaultArgs> = $Result.GetResult<Prisma.$ReceitaCategoriaPayload, S>

  type ReceitaCategoriaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ReceitaCategoriaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReceitaCategoriaCountAggregateInputType | true
    }

  export interface ReceitaCategoriaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ReceitaCategoria'], meta: { name: 'ReceitaCategoria' } }
    /**
     * Find zero or one ReceitaCategoria that matches the filter.
     * @param {ReceitaCategoriaFindUniqueArgs} args - Arguments to find a ReceitaCategoria
     * @example
     * // Get one ReceitaCategoria
     * const receitaCategoria = await prisma.receitaCategoria.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReceitaCategoriaFindUniqueArgs>(args: SelectSubset<T, ReceitaCategoriaFindUniqueArgs<ExtArgs>>): Prisma__ReceitaCategoriaClient<$Result.GetResult<Prisma.$ReceitaCategoriaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ReceitaCategoria that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReceitaCategoriaFindUniqueOrThrowArgs} args - Arguments to find a ReceitaCategoria
     * @example
     * // Get one ReceitaCategoria
     * const receitaCategoria = await prisma.receitaCategoria.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReceitaCategoriaFindUniqueOrThrowArgs>(args: SelectSubset<T, ReceitaCategoriaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReceitaCategoriaClient<$Result.GetResult<Prisma.$ReceitaCategoriaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ReceitaCategoria that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReceitaCategoriaFindFirstArgs} args - Arguments to find a ReceitaCategoria
     * @example
     * // Get one ReceitaCategoria
     * const receitaCategoria = await prisma.receitaCategoria.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReceitaCategoriaFindFirstArgs>(args?: SelectSubset<T, ReceitaCategoriaFindFirstArgs<ExtArgs>>): Prisma__ReceitaCategoriaClient<$Result.GetResult<Prisma.$ReceitaCategoriaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ReceitaCategoria that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReceitaCategoriaFindFirstOrThrowArgs} args - Arguments to find a ReceitaCategoria
     * @example
     * // Get one ReceitaCategoria
     * const receitaCategoria = await prisma.receitaCategoria.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReceitaCategoriaFindFirstOrThrowArgs>(args?: SelectSubset<T, ReceitaCategoriaFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReceitaCategoriaClient<$Result.GetResult<Prisma.$ReceitaCategoriaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ReceitaCategorias that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReceitaCategoriaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ReceitaCategorias
     * const receitaCategorias = await prisma.receitaCategoria.findMany()
     * 
     * // Get first 10 ReceitaCategorias
     * const receitaCategorias = await prisma.receitaCategoria.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const receitaCategoriaWithIdOnly = await prisma.receitaCategoria.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReceitaCategoriaFindManyArgs>(args?: SelectSubset<T, ReceitaCategoriaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReceitaCategoriaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ReceitaCategoria.
     * @param {ReceitaCategoriaCreateArgs} args - Arguments to create a ReceitaCategoria.
     * @example
     * // Create one ReceitaCategoria
     * const ReceitaCategoria = await prisma.receitaCategoria.create({
     *   data: {
     *     // ... data to create a ReceitaCategoria
     *   }
     * })
     * 
     */
    create<T extends ReceitaCategoriaCreateArgs>(args: SelectSubset<T, ReceitaCategoriaCreateArgs<ExtArgs>>): Prisma__ReceitaCategoriaClient<$Result.GetResult<Prisma.$ReceitaCategoriaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ReceitaCategorias.
     * @param {ReceitaCategoriaCreateManyArgs} args - Arguments to create many ReceitaCategorias.
     * @example
     * // Create many ReceitaCategorias
     * const receitaCategoria = await prisma.receitaCategoria.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReceitaCategoriaCreateManyArgs>(args?: SelectSubset<T, ReceitaCategoriaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ReceitaCategorias and returns the data saved in the database.
     * @param {ReceitaCategoriaCreateManyAndReturnArgs} args - Arguments to create many ReceitaCategorias.
     * @example
     * // Create many ReceitaCategorias
     * const receitaCategoria = await prisma.receitaCategoria.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ReceitaCategorias and only return the `id`
     * const receitaCategoriaWithIdOnly = await prisma.receitaCategoria.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReceitaCategoriaCreateManyAndReturnArgs>(args?: SelectSubset<T, ReceitaCategoriaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReceitaCategoriaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ReceitaCategoria.
     * @param {ReceitaCategoriaDeleteArgs} args - Arguments to delete one ReceitaCategoria.
     * @example
     * // Delete one ReceitaCategoria
     * const ReceitaCategoria = await prisma.receitaCategoria.delete({
     *   where: {
     *     // ... filter to delete one ReceitaCategoria
     *   }
     * })
     * 
     */
    delete<T extends ReceitaCategoriaDeleteArgs>(args: SelectSubset<T, ReceitaCategoriaDeleteArgs<ExtArgs>>): Prisma__ReceitaCategoriaClient<$Result.GetResult<Prisma.$ReceitaCategoriaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ReceitaCategoria.
     * @param {ReceitaCategoriaUpdateArgs} args - Arguments to update one ReceitaCategoria.
     * @example
     * // Update one ReceitaCategoria
     * const receitaCategoria = await prisma.receitaCategoria.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReceitaCategoriaUpdateArgs>(args: SelectSubset<T, ReceitaCategoriaUpdateArgs<ExtArgs>>): Prisma__ReceitaCategoriaClient<$Result.GetResult<Prisma.$ReceitaCategoriaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ReceitaCategorias.
     * @param {ReceitaCategoriaDeleteManyArgs} args - Arguments to filter ReceitaCategorias to delete.
     * @example
     * // Delete a few ReceitaCategorias
     * const { count } = await prisma.receitaCategoria.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReceitaCategoriaDeleteManyArgs>(args?: SelectSubset<T, ReceitaCategoriaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReceitaCategorias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReceitaCategoriaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ReceitaCategorias
     * const receitaCategoria = await prisma.receitaCategoria.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReceitaCategoriaUpdateManyArgs>(args: SelectSubset<T, ReceitaCategoriaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReceitaCategorias and returns the data updated in the database.
     * @param {ReceitaCategoriaUpdateManyAndReturnArgs} args - Arguments to update many ReceitaCategorias.
     * @example
     * // Update many ReceitaCategorias
     * const receitaCategoria = await prisma.receitaCategoria.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ReceitaCategorias and only return the `id`
     * const receitaCategoriaWithIdOnly = await prisma.receitaCategoria.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ReceitaCategoriaUpdateManyAndReturnArgs>(args: SelectSubset<T, ReceitaCategoriaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReceitaCategoriaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ReceitaCategoria.
     * @param {ReceitaCategoriaUpsertArgs} args - Arguments to update or create a ReceitaCategoria.
     * @example
     * // Update or create a ReceitaCategoria
     * const receitaCategoria = await prisma.receitaCategoria.upsert({
     *   create: {
     *     // ... data to create a ReceitaCategoria
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ReceitaCategoria we want to update
     *   }
     * })
     */
    upsert<T extends ReceitaCategoriaUpsertArgs>(args: SelectSubset<T, ReceitaCategoriaUpsertArgs<ExtArgs>>): Prisma__ReceitaCategoriaClient<$Result.GetResult<Prisma.$ReceitaCategoriaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ReceitaCategorias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReceitaCategoriaCountArgs} args - Arguments to filter ReceitaCategorias to count.
     * @example
     * // Count the number of ReceitaCategorias
     * const count = await prisma.receitaCategoria.count({
     *   where: {
     *     // ... the filter for the ReceitaCategorias we want to count
     *   }
     * })
    **/
    count<T extends ReceitaCategoriaCountArgs>(
      args?: Subset<T, ReceitaCategoriaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReceitaCategoriaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ReceitaCategoria.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReceitaCategoriaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReceitaCategoriaAggregateArgs>(args: Subset<T, ReceitaCategoriaAggregateArgs>): Prisma.PrismaPromise<GetReceitaCategoriaAggregateType<T>>

    /**
     * Group by ReceitaCategoria.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReceitaCategoriaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReceitaCategoriaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReceitaCategoriaGroupByArgs['orderBy'] }
        : { orderBy?: ReceitaCategoriaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReceitaCategoriaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReceitaCategoriaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ReceitaCategoria model
   */
  readonly fields: ReceitaCategoriaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ReceitaCategoria.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReceitaCategoriaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    dashboard<T extends DashboardComercialDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DashboardComercialDefaultArgs<ExtArgs>>): Prisma__DashboardComercialClient<$Result.GetResult<Prisma.$DashboardComercialPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ReceitaCategoria model
   */
  interface ReceitaCategoriaFieldRefs {
    readonly id: FieldRef<"ReceitaCategoria", 'String'>
    readonly dashboardId: FieldRef<"ReceitaCategoria", 'String'>
    readonly categoria: FieldRef<"ReceitaCategoria", 'String'>
    readonly receita: FieldRef<"ReceitaCategoria", 'Decimal'>
  }
    

  // Custom InputTypes
  /**
   * ReceitaCategoria findUnique
   */
  export type ReceitaCategoriaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceitaCategoria
     */
    select?: ReceitaCategoriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReceitaCategoria
     */
    omit?: ReceitaCategoriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceitaCategoriaInclude<ExtArgs> | null
    /**
     * Filter, which ReceitaCategoria to fetch.
     */
    where: ReceitaCategoriaWhereUniqueInput
  }

  /**
   * ReceitaCategoria findUniqueOrThrow
   */
  export type ReceitaCategoriaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceitaCategoria
     */
    select?: ReceitaCategoriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReceitaCategoria
     */
    omit?: ReceitaCategoriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceitaCategoriaInclude<ExtArgs> | null
    /**
     * Filter, which ReceitaCategoria to fetch.
     */
    where: ReceitaCategoriaWhereUniqueInput
  }

  /**
   * ReceitaCategoria findFirst
   */
  export type ReceitaCategoriaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceitaCategoria
     */
    select?: ReceitaCategoriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReceitaCategoria
     */
    omit?: ReceitaCategoriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceitaCategoriaInclude<ExtArgs> | null
    /**
     * Filter, which ReceitaCategoria to fetch.
     */
    where?: ReceitaCategoriaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReceitaCategorias to fetch.
     */
    orderBy?: ReceitaCategoriaOrderByWithRelationInput | ReceitaCategoriaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReceitaCategorias.
     */
    cursor?: ReceitaCategoriaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReceitaCategorias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReceitaCategorias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReceitaCategorias.
     */
    distinct?: ReceitaCategoriaScalarFieldEnum | ReceitaCategoriaScalarFieldEnum[]
  }

  /**
   * ReceitaCategoria findFirstOrThrow
   */
  export type ReceitaCategoriaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceitaCategoria
     */
    select?: ReceitaCategoriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReceitaCategoria
     */
    omit?: ReceitaCategoriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceitaCategoriaInclude<ExtArgs> | null
    /**
     * Filter, which ReceitaCategoria to fetch.
     */
    where?: ReceitaCategoriaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReceitaCategorias to fetch.
     */
    orderBy?: ReceitaCategoriaOrderByWithRelationInput | ReceitaCategoriaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReceitaCategorias.
     */
    cursor?: ReceitaCategoriaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReceitaCategorias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReceitaCategorias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReceitaCategorias.
     */
    distinct?: ReceitaCategoriaScalarFieldEnum | ReceitaCategoriaScalarFieldEnum[]
  }

  /**
   * ReceitaCategoria findMany
   */
  export type ReceitaCategoriaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceitaCategoria
     */
    select?: ReceitaCategoriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReceitaCategoria
     */
    omit?: ReceitaCategoriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceitaCategoriaInclude<ExtArgs> | null
    /**
     * Filter, which ReceitaCategorias to fetch.
     */
    where?: ReceitaCategoriaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReceitaCategorias to fetch.
     */
    orderBy?: ReceitaCategoriaOrderByWithRelationInput | ReceitaCategoriaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ReceitaCategorias.
     */
    cursor?: ReceitaCategoriaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReceitaCategorias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReceitaCategorias.
     */
    skip?: number
    distinct?: ReceitaCategoriaScalarFieldEnum | ReceitaCategoriaScalarFieldEnum[]
  }

  /**
   * ReceitaCategoria create
   */
  export type ReceitaCategoriaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceitaCategoria
     */
    select?: ReceitaCategoriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReceitaCategoria
     */
    omit?: ReceitaCategoriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceitaCategoriaInclude<ExtArgs> | null
    /**
     * The data needed to create a ReceitaCategoria.
     */
    data: XOR<ReceitaCategoriaCreateInput, ReceitaCategoriaUncheckedCreateInput>
  }

  /**
   * ReceitaCategoria createMany
   */
  export type ReceitaCategoriaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ReceitaCategorias.
     */
    data: ReceitaCategoriaCreateManyInput | ReceitaCategoriaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ReceitaCategoria createManyAndReturn
   */
  export type ReceitaCategoriaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceitaCategoria
     */
    select?: ReceitaCategoriaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ReceitaCategoria
     */
    omit?: ReceitaCategoriaOmit<ExtArgs> | null
    /**
     * The data used to create many ReceitaCategorias.
     */
    data: ReceitaCategoriaCreateManyInput | ReceitaCategoriaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceitaCategoriaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ReceitaCategoria update
   */
  export type ReceitaCategoriaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceitaCategoria
     */
    select?: ReceitaCategoriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReceitaCategoria
     */
    omit?: ReceitaCategoriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceitaCategoriaInclude<ExtArgs> | null
    /**
     * The data needed to update a ReceitaCategoria.
     */
    data: XOR<ReceitaCategoriaUpdateInput, ReceitaCategoriaUncheckedUpdateInput>
    /**
     * Choose, which ReceitaCategoria to update.
     */
    where: ReceitaCategoriaWhereUniqueInput
  }

  /**
   * ReceitaCategoria updateMany
   */
  export type ReceitaCategoriaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ReceitaCategorias.
     */
    data: XOR<ReceitaCategoriaUpdateManyMutationInput, ReceitaCategoriaUncheckedUpdateManyInput>
    /**
     * Filter which ReceitaCategorias to update
     */
    where?: ReceitaCategoriaWhereInput
    /**
     * Limit how many ReceitaCategorias to update.
     */
    limit?: number
  }

  /**
   * ReceitaCategoria updateManyAndReturn
   */
  export type ReceitaCategoriaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceitaCategoria
     */
    select?: ReceitaCategoriaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ReceitaCategoria
     */
    omit?: ReceitaCategoriaOmit<ExtArgs> | null
    /**
     * The data used to update ReceitaCategorias.
     */
    data: XOR<ReceitaCategoriaUpdateManyMutationInput, ReceitaCategoriaUncheckedUpdateManyInput>
    /**
     * Filter which ReceitaCategorias to update
     */
    where?: ReceitaCategoriaWhereInput
    /**
     * Limit how many ReceitaCategorias to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceitaCategoriaIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ReceitaCategoria upsert
   */
  export type ReceitaCategoriaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceitaCategoria
     */
    select?: ReceitaCategoriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReceitaCategoria
     */
    omit?: ReceitaCategoriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceitaCategoriaInclude<ExtArgs> | null
    /**
     * The filter to search for the ReceitaCategoria to update in case it exists.
     */
    where: ReceitaCategoriaWhereUniqueInput
    /**
     * In case the ReceitaCategoria found by the `where` argument doesn't exist, create a new ReceitaCategoria with this data.
     */
    create: XOR<ReceitaCategoriaCreateInput, ReceitaCategoriaUncheckedCreateInput>
    /**
     * In case the ReceitaCategoria was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReceitaCategoriaUpdateInput, ReceitaCategoriaUncheckedUpdateInput>
  }

  /**
   * ReceitaCategoria delete
   */
  export type ReceitaCategoriaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceitaCategoria
     */
    select?: ReceitaCategoriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReceitaCategoria
     */
    omit?: ReceitaCategoriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceitaCategoriaInclude<ExtArgs> | null
    /**
     * Filter which ReceitaCategoria to delete.
     */
    where: ReceitaCategoriaWhereUniqueInput
  }

  /**
   * ReceitaCategoria deleteMany
   */
  export type ReceitaCategoriaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReceitaCategorias to delete
     */
    where?: ReceitaCategoriaWhereInput
    /**
     * Limit how many ReceitaCategorias to delete.
     */
    limit?: number
  }

  /**
   * ReceitaCategoria without action
   */
  export type ReceitaCategoriaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceitaCategoria
     */
    select?: ReceitaCategoriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReceitaCategoria
     */
    omit?: ReceitaCategoriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceitaCategoriaInclude<ExtArgs> | null
  }


  /**
   * Model ReceitaMetodoPagamento
   */

  export type AggregateReceitaMetodoPagamento = {
    _count: ReceitaMetodoPagamentoCountAggregateOutputType | null
    _avg: ReceitaMetodoPagamentoAvgAggregateOutputType | null
    _sum: ReceitaMetodoPagamentoSumAggregateOutputType | null
    _min: ReceitaMetodoPagamentoMinAggregateOutputType | null
    _max: ReceitaMetodoPagamentoMaxAggregateOutputType | null
  }

  export type ReceitaMetodoPagamentoAvgAggregateOutputType = {
    receita: Decimal | null
  }

  export type ReceitaMetodoPagamentoSumAggregateOutputType = {
    receita: Decimal | null
  }

  export type ReceitaMetodoPagamentoMinAggregateOutputType = {
    id: string | null
    dashboardId: string | null
    metodoPagamento: string | null
    receita: Decimal | null
  }

  export type ReceitaMetodoPagamentoMaxAggregateOutputType = {
    id: string | null
    dashboardId: string | null
    metodoPagamento: string | null
    receita: Decimal | null
  }

  export type ReceitaMetodoPagamentoCountAggregateOutputType = {
    id: number
    dashboardId: number
    metodoPagamento: number
    receita: number
    _all: number
  }


  export type ReceitaMetodoPagamentoAvgAggregateInputType = {
    receita?: true
  }

  export type ReceitaMetodoPagamentoSumAggregateInputType = {
    receita?: true
  }

  export type ReceitaMetodoPagamentoMinAggregateInputType = {
    id?: true
    dashboardId?: true
    metodoPagamento?: true
    receita?: true
  }

  export type ReceitaMetodoPagamentoMaxAggregateInputType = {
    id?: true
    dashboardId?: true
    metodoPagamento?: true
    receita?: true
  }

  export type ReceitaMetodoPagamentoCountAggregateInputType = {
    id?: true
    dashboardId?: true
    metodoPagamento?: true
    receita?: true
    _all?: true
  }

  export type ReceitaMetodoPagamentoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReceitaMetodoPagamento to aggregate.
     */
    where?: ReceitaMetodoPagamentoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReceitaMetodoPagamentos to fetch.
     */
    orderBy?: ReceitaMetodoPagamentoOrderByWithRelationInput | ReceitaMetodoPagamentoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReceitaMetodoPagamentoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReceitaMetodoPagamentos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReceitaMetodoPagamentos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ReceitaMetodoPagamentos
    **/
    _count?: true | ReceitaMetodoPagamentoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReceitaMetodoPagamentoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReceitaMetodoPagamentoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReceitaMetodoPagamentoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReceitaMetodoPagamentoMaxAggregateInputType
  }

  export type GetReceitaMetodoPagamentoAggregateType<T extends ReceitaMetodoPagamentoAggregateArgs> = {
        [P in keyof T & keyof AggregateReceitaMetodoPagamento]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReceitaMetodoPagamento[P]>
      : GetScalarType<T[P], AggregateReceitaMetodoPagamento[P]>
  }




  export type ReceitaMetodoPagamentoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReceitaMetodoPagamentoWhereInput
    orderBy?: ReceitaMetodoPagamentoOrderByWithAggregationInput | ReceitaMetodoPagamentoOrderByWithAggregationInput[]
    by: ReceitaMetodoPagamentoScalarFieldEnum[] | ReceitaMetodoPagamentoScalarFieldEnum
    having?: ReceitaMetodoPagamentoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReceitaMetodoPagamentoCountAggregateInputType | true
    _avg?: ReceitaMetodoPagamentoAvgAggregateInputType
    _sum?: ReceitaMetodoPagamentoSumAggregateInputType
    _min?: ReceitaMetodoPagamentoMinAggregateInputType
    _max?: ReceitaMetodoPagamentoMaxAggregateInputType
  }

  export type ReceitaMetodoPagamentoGroupByOutputType = {
    id: string
    dashboardId: string
    metodoPagamento: string
    receita: Decimal
    _count: ReceitaMetodoPagamentoCountAggregateOutputType | null
    _avg: ReceitaMetodoPagamentoAvgAggregateOutputType | null
    _sum: ReceitaMetodoPagamentoSumAggregateOutputType | null
    _min: ReceitaMetodoPagamentoMinAggregateOutputType | null
    _max: ReceitaMetodoPagamentoMaxAggregateOutputType | null
  }

  type GetReceitaMetodoPagamentoGroupByPayload<T extends ReceitaMetodoPagamentoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReceitaMetodoPagamentoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReceitaMetodoPagamentoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReceitaMetodoPagamentoGroupByOutputType[P]>
            : GetScalarType<T[P], ReceitaMetodoPagamentoGroupByOutputType[P]>
        }
      >
    >


  export type ReceitaMetodoPagamentoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dashboardId?: boolean
    metodoPagamento?: boolean
    receita?: boolean
    dashboard?: boolean | DashboardComercialDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["receitaMetodoPagamento"]>

  export type ReceitaMetodoPagamentoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dashboardId?: boolean
    metodoPagamento?: boolean
    receita?: boolean
    dashboard?: boolean | DashboardComercialDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["receitaMetodoPagamento"]>

  export type ReceitaMetodoPagamentoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dashboardId?: boolean
    metodoPagamento?: boolean
    receita?: boolean
    dashboard?: boolean | DashboardComercialDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["receitaMetodoPagamento"]>

  export type ReceitaMetodoPagamentoSelectScalar = {
    id?: boolean
    dashboardId?: boolean
    metodoPagamento?: boolean
    receita?: boolean
  }

  export type ReceitaMetodoPagamentoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "dashboardId" | "metodoPagamento" | "receita", ExtArgs["result"]["receitaMetodoPagamento"]>
  export type ReceitaMetodoPagamentoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dashboard?: boolean | DashboardComercialDefaultArgs<ExtArgs>
  }
  export type ReceitaMetodoPagamentoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dashboard?: boolean | DashboardComercialDefaultArgs<ExtArgs>
  }
  export type ReceitaMetodoPagamentoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dashboard?: boolean | DashboardComercialDefaultArgs<ExtArgs>
  }

  export type $ReceitaMetodoPagamentoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ReceitaMetodoPagamento"
    objects: {
      dashboard: Prisma.$DashboardComercialPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      dashboardId: string
      metodoPagamento: string
      receita: Prisma.Decimal
    }, ExtArgs["result"]["receitaMetodoPagamento"]>
    composites: {}
  }

  type ReceitaMetodoPagamentoGetPayload<S extends boolean | null | undefined | ReceitaMetodoPagamentoDefaultArgs> = $Result.GetResult<Prisma.$ReceitaMetodoPagamentoPayload, S>

  type ReceitaMetodoPagamentoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ReceitaMetodoPagamentoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReceitaMetodoPagamentoCountAggregateInputType | true
    }

  export interface ReceitaMetodoPagamentoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ReceitaMetodoPagamento'], meta: { name: 'ReceitaMetodoPagamento' } }
    /**
     * Find zero or one ReceitaMetodoPagamento that matches the filter.
     * @param {ReceitaMetodoPagamentoFindUniqueArgs} args - Arguments to find a ReceitaMetodoPagamento
     * @example
     * // Get one ReceitaMetodoPagamento
     * const receitaMetodoPagamento = await prisma.receitaMetodoPagamento.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReceitaMetodoPagamentoFindUniqueArgs>(args: SelectSubset<T, ReceitaMetodoPagamentoFindUniqueArgs<ExtArgs>>): Prisma__ReceitaMetodoPagamentoClient<$Result.GetResult<Prisma.$ReceitaMetodoPagamentoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ReceitaMetodoPagamento that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReceitaMetodoPagamentoFindUniqueOrThrowArgs} args - Arguments to find a ReceitaMetodoPagamento
     * @example
     * // Get one ReceitaMetodoPagamento
     * const receitaMetodoPagamento = await prisma.receitaMetodoPagamento.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReceitaMetodoPagamentoFindUniqueOrThrowArgs>(args: SelectSubset<T, ReceitaMetodoPagamentoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReceitaMetodoPagamentoClient<$Result.GetResult<Prisma.$ReceitaMetodoPagamentoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ReceitaMetodoPagamento that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReceitaMetodoPagamentoFindFirstArgs} args - Arguments to find a ReceitaMetodoPagamento
     * @example
     * // Get one ReceitaMetodoPagamento
     * const receitaMetodoPagamento = await prisma.receitaMetodoPagamento.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReceitaMetodoPagamentoFindFirstArgs>(args?: SelectSubset<T, ReceitaMetodoPagamentoFindFirstArgs<ExtArgs>>): Prisma__ReceitaMetodoPagamentoClient<$Result.GetResult<Prisma.$ReceitaMetodoPagamentoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ReceitaMetodoPagamento that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReceitaMetodoPagamentoFindFirstOrThrowArgs} args - Arguments to find a ReceitaMetodoPagamento
     * @example
     * // Get one ReceitaMetodoPagamento
     * const receitaMetodoPagamento = await prisma.receitaMetodoPagamento.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReceitaMetodoPagamentoFindFirstOrThrowArgs>(args?: SelectSubset<T, ReceitaMetodoPagamentoFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReceitaMetodoPagamentoClient<$Result.GetResult<Prisma.$ReceitaMetodoPagamentoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ReceitaMetodoPagamentos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReceitaMetodoPagamentoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ReceitaMetodoPagamentos
     * const receitaMetodoPagamentos = await prisma.receitaMetodoPagamento.findMany()
     * 
     * // Get first 10 ReceitaMetodoPagamentos
     * const receitaMetodoPagamentos = await prisma.receitaMetodoPagamento.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const receitaMetodoPagamentoWithIdOnly = await prisma.receitaMetodoPagamento.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReceitaMetodoPagamentoFindManyArgs>(args?: SelectSubset<T, ReceitaMetodoPagamentoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReceitaMetodoPagamentoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ReceitaMetodoPagamento.
     * @param {ReceitaMetodoPagamentoCreateArgs} args - Arguments to create a ReceitaMetodoPagamento.
     * @example
     * // Create one ReceitaMetodoPagamento
     * const ReceitaMetodoPagamento = await prisma.receitaMetodoPagamento.create({
     *   data: {
     *     // ... data to create a ReceitaMetodoPagamento
     *   }
     * })
     * 
     */
    create<T extends ReceitaMetodoPagamentoCreateArgs>(args: SelectSubset<T, ReceitaMetodoPagamentoCreateArgs<ExtArgs>>): Prisma__ReceitaMetodoPagamentoClient<$Result.GetResult<Prisma.$ReceitaMetodoPagamentoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ReceitaMetodoPagamentos.
     * @param {ReceitaMetodoPagamentoCreateManyArgs} args - Arguments to create many ReceitaMetodoPagamentos.
     * @example
     * // Create many ReceitaMetodoPagamentos
     * const receitaMetodoPagamento = await prisma.receitaMetodoPagamento.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReceitaMetodoPagamentoCreateManyArgs>(args?: SelectSubset<T, ReceitaMetodoPagamentoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ReceitaMetodoPagamentos and returns the data saved in the database.
     * @param {ReceitaMetodoPagamentoCreateManyAndReturnArgs} args - Arguments to create many ReceitaMetodoPagamentos.
     * @example
     * // Create many ReceitaMetodoPagamentos
     * const receitaMetodoPagamento = await prisma.receitaMetodoPagamento.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ReceitaMetodoPagamentos and only return the `id`
     * const receitaMetodoPagamentoWithIdOnly = await prisma.receitaMetodoPagamento.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReceitaMetodoPagamentoCreateManyAndReturnArgs>(args?: SelectSubset<T, ReceitaMetodoPagamentoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReceitaMetodoPagamentoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ReceitaMetodoPagamento.
     * @param {ReceitaMetodoPagamentoDeleteArgs} args - Arguments to delete one ReceitaMetodoPagamento.
     * @example
     * // Delete one ReceitaMetodoPagamento
     * const ReceitaMetodoPagamento = await prisma.receitaMetodoPagamento.delete({
     *   where: {
     *     // ... filter to delete one ReceitaMetodoPagamento
     *   }
     * })
     * 
     */
    delete<T extends ReceitaMetodoPagamentoDeleteArgs>(args: SelectSubset<T, ReceitaMetodoPagamentoDeleteArgs<ExtArgs>>): Prisma__ReceitaMetodoPagamentoClient<$Result.GetResult<Prisma.$ReceitaMetodoPagamentoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ReceitaMetodoPagamento.
     * @param {ReceitaMetodoPagamentoUpdateArgs} args - Arguments to update one ReceitaMetodoPagamento.
     * @example
     * // Update one ReceitaMetodoPagamento
     * const receitaMetodoPagamento = await prisma.receitaMetodoPagamento.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReceitaMetodoPagamentoUpdateArgs>(args: SelectSubset<T, ReceitaMetodoPagamentoUpdateArgs<ExtArgs>>): Prisma__ReceitaMetodoPagamentoClient<$Result.GetResult<Prisma.$ReceitaMetodoPagamentoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ReceitaMetodoPagamentos.
     * @param {ReceitaMetodoPagamentoDeleteManyArgs} args - Arguments to filter ReceitaMetodoPagamentos to delete.
     * @example
     * // Delete a few ReceitaMetodoPagamentos
     * const { count } = await prisma.receitaMetodoPagamento.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReceitaMetodoPagamentoDeleteManyArgs>(args?: SelectSubset<T, ReceitaMetodoPagamentoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReceitaMetodoPagamentos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReceitaMetodoPagamentoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ReceitaMetodoPagamentos
     * const receitaMetodoPagamento = await prisma.receitaMetodoPagamento.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReceitaMetodoPagamentoUpdateManyArgs>(args: SelectSubset<T, ReceitaMetodoPagamentoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReceitaMetodoPagamentos and returns the data updated in the database.
     * @param {ReceitaMetodoPagamentoUpdateManyAndReturnArgs} args - Arguments to update many ReceitaMetodoPagamentos.
     * @example
     * // Update many ReceitaMetodoPagamentos
     * const receitaMetodoPagamento = await prisma.receitaMetodoPagamento.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ReceitaMetodoPagamentos and only return the `id`
     * const receitaMetodoPagamentoWithIdOnly = await prisma.receitaMetodoPagamento.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ReceitaMetodoPagamentoUpdateManyAndReturnArgs>(args: SelectSubset<T, ReceitaMetodoPagamentoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReceitaMetodoPagamentoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ReceitaMetodoPagamento.
     * @param {ReceitaMetodoPagamentoUpsertArgs} args - Arguments to update or create a ReceitaMetodoPagamento.
     * @example
     * // Update or create a ReceitaMetodoPagamento
     * const receitaMetodoPagamento = await prisma.receitaMetodoPagamento.upsert({
     *   create: {
     *     // ... data to create a ReceitaMetodoPagamento
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ReceitaMetodoPagamento we want to update
     *   }
     * })
     */
    upsert<T extends ReceitaMetodoPagamentoUpsertArgs>(args: SelectSubset<T, ReceitaMetodoPagamentoUpsertArgs<ExtArgs>>): Prisma__ReceitaMetodoPagamentoClient<$Result.GetResult<Prisma.$ReceitaMetodoPagamentoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ReceitaMetodoPagamentos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReceitaMetodoPagamentoCountArgs} args - Arguments to filter ReceitaMetodoPagamentos to count.
     * @example
     * // Count the number of ReceitaMetodoPagamentos
     * const count = await prisma.receitaMetodoPagamento.count({
     *   where: {
     *     // ... the filter for the ReceitaMetodoPagamentos we want to count
     *   }
     * })
    **/
    count<T extends ReceitaMetodoPagamentoCountArgs>(
      args?: Subset<T, ReceitaMetodoPagamentoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReceitaMetodoPagamentoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ReceitaMetodoPagamento.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReceitaMetodoPagamentoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReceitaMetodoPagamentoAggregateArgs>(args: Subset<T, ReceitaMetodoPagamentoAggregateArgs>): Prisma.PrismaPromise<GetReceitaMetodoPagamentoAggregateType<T>>

    /**
     * Group by ReceitaMetodoPagamento.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReceitaMetodoPagamentoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReceitaMetodoPagamentoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReceitaMetodoPagamentoGroupByArgs['orderBy'] }
        : { orderBy?: ReceitaMetodoPagamentoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReceitaMetodoPagamentoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReceitaMetodoPagamentoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ReceitaMetodoPagamento model
   */
  readonly fields: ReceitaMetodoPagamentoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ReceitaMetodoPagamento.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReceitaMetodoPagamentoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    dashboard<T extends DashboardComercialDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DashboardComercialDefaultArgs<ExtArgs>>): Prisma__DashboardComercialClient<$Result.GetResult<Prisma.$DashboardComercialPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ReceitaMetodoPagamento model
   */
  interface ReceitaMetodoPagamentoFieldRefs {
    readonly id: FieldRef<"ReceitaMetodoPagamento", 'String'>
    readonly dashboardId: FieldRef<"ReceitaMetodoPagamento", 'String'>
    readonly metodoPagamento: FieldRef<"ReceitaMetodoPagamento", 'String'>
    readonly receita: FieldRef<"ReceitaMetodoPagamento", 'Decimal'>
  }
    

  // Custom InputTypes
  /**
   * ReceitaMetodoPagamento findUnique
   */
  export type ReceitaMetodoPagamentoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceitaMetodoPagamento
     */
    select?: ReceitaMetodoPagamentoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReceitaMetodoPagamento
     */
    omit?: ReceitaMetodoPagamentoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceitaMetodoPagamentoInclude<ExtArgs> | null
    /**
     * Filter, which ReceitaMetodoPagamento to fetch.
     */
    where: ReceitaMetodoPagamentoWhereUniqueInput
  }

  /**
   * ReceitaMetodoPagamento findUniqueOrThrow
   */
  export type ReceitaMetodoPagamentoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceitaMetodoPagamento
     */
    select?: ReceitaMetodoPagamentoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReceitaMetodoPagamento
     */
    omit?: ReceitaMetodoPagamentoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceitaMetodoPagamentoInclude<ExtArgs> | null
    /**
     * Filter, which ReceitaMetodoPagamento to fetch.
     */
    where: ReceitaMetodoPagamentoWhereUniqueInput
  }

  /**
   * ReceitaMetodoPagamento findFirst
   */
  export type ReceitaMetodoPagamentoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceitaMetodoPagamento
     */
    select?: ReceitaMetodoPagamentoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReceitaMetodoPagamento
     */
    omit?: ReceitaMetodoPagamentoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceitaMetodoPagamentoInclude<ExtArgs> | null
    /**
     * Filter, which ReceitaMetodoPagamento to fetch.
     */
    where?: ReceitaMetodoPagamentoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReceitaMetodoPagamentos to fetch.
     */
    orderBy?: ReceitaMetodoPagamentoOrderByWithRelationInput | ReceitaMetodoPagamentoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReceitaMetodoPagamentos.
     */
    cursor?: ReceitaMetodoPagamentoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReceitaMetodoPagamentos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReceitaMetodoPagamentos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReceitaMetodoPagamentos.
     */
    distinct?: ReceitaMetodoPagamentoScalarFieldEnum | ReceitaMetodoPagamentoScalarFieldEnum[]
  }

  /**
   * ReceitaMetodoPagamento findFirstOrThrow
   */
  export type ReceitaMetodoPagamentoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceitaMetodoPagamento
     */
    select?: ReceitaMetodoPagamentoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReceitaMetodoPagamento
     */
    omit?: ReceitaMetodoPagamentoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceitaMetodoPagamentoInclude<ExtArgs> | null
    /**
     * Filter, which ReceitaMetodoPagamento to fetch.
     */
    where?: ReceitaMetodoPagamentoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReceitaMetodoPagamentos to fetch.
     */
    orderBy?: ReceitaMetodoPagamentoOrderByWithRelationInput | ReceitaMetodoPagamentoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReceitaMetodoPagamentos.
     */
    cursor?: ReceitaMetodoPagamentoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReceitaMetodoPagamentos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReceitaMetodoPagamentos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReceitaMetodoPagamentos.
     */
    distinct?: ReceitaMetodoPagamentoScalarFieldEnum | ReceitaMetodoPagamentoScalarFieldEnum[]
  }

  /**
   * ReceitaMetodoPagamento findMany
   */
  export type ReceitaMetodoPagamentoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceitaMetodoPagamento
     */
    select?: ReceitaMetodoPagamentoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReceitaMetodoPagamento
     */
    omit?: ReceitaMetodoPagamentoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceitaMetodoPagamentoInclude<ExtArgs> | null
    /**
     * Filter, which ReceitaMetodoPagamentos to fetch.
     */
    where?: ReceitaMetodoPagamentoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReceitaMetodoPagamentos to fetch.
     */
    orderBy?: ReceitaMetodoPagamentoOrderByWithRelationInput | ReceitaMetodoPagamentoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ReceitaMetodoPagamentos.
     */
    cursor?: ReceitaMetodoPagamentoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReceitaMetodoPagamentos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReceitaMetodoPagamentos.
     */
    skip?: number
    distinct?: ReceitaMetodoPagamentoScalarFieldEnum | ReceitaMetodoPagamentoScalarFieldEnum[]
  }

  /**
   * ReceitaMetodoPagamento create
   */
  export type ReceitaMetodoPagamentoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceitaMetodoPagamento
     */
    select?: ReceitaMetodoPagamentoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReceitaMetodoPagamento
     */
    omit?: ReceitaMetodoPagamentoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceitaMetodoPagamentoInclude<ExtArgs> | null
    /**
     * The data needed to create a ReceitaMetodoPagamento.
     */
    data: XOR<ReceitaMetodoPagamentoCreateInput, ReceitaMetodoPagamentoUncheckedCreateInput>
  }

  /**
   * ReceitaMetodoPagamento createMany
   */
  export type ReceitaMetodoPagamentoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ReceitaMetodoPagamentos.
     */
    data: ReceitaMetodoPagamentoCreateManyInput | ReceitaMetodoPagamentoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ReceitaMetodoPagamento createManyAndReturn
   */
  export type ReceitaMetodoPagamentoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceitaMetodoPagamento
     */
    select?: ReceitaMetodoPagamentoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ReceitaMetodoPagamento
     */
    omit?: ReceitaMetodoPagamentoOmit<ExtArgs> | null
    /**
     * The data used to create many ReceitaMetodoPagamentos.
     */
    data: ReceitaMetodoPagamentoCreateManyInput | ReceitaMetodoPagamentoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceitaMetodoPagamentoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ReceitaMetodoPagamento update
   */
  export type ReceitaMetodoPagamentoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceitaMetodoPagamento
     */
    select?: ReceitaMetodoPagamentoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReceitaMetodoPagamento
     */
    omit?: ReceitaMetodoPagamentoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceitaMetodoPagamentoInclude<ExtArgs> | null
    /**
     * The data needed to update a ReceitaMetodoPagamento.
     */
    data: XOR<ReceitaMetodoPagamentoUpdateInput, ReceitaMetodoPagamentoUncheckedUpdateInput>
    /**
     * Choose, which ReceitaMetodoPagamento to update.
     */
    where: ReceitaMetodoPagamentoWhereUniqueInput
  }

  /**
   * ReceitaMetodoPagamento updateMany
   */
  export type ReceitaMetodoPagamentoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ReceitaMetodoPagamentos.
     */
    data: XOR<ReceitaMetodoPagamentoUpdateManyMutationInput, ReceitaMetodoPagamentoUncheckedUpdateManyInput>
    /**
     * Filter which ReceitaMetodoPagamentos to update
     */
    where?: ReceitaMetodoPagamentoWhereInput
    /**
     * Limit how many ReceitaMetodoPagamentos to update.
     */
    limit?: number
  }

  /**
   * ReceitaMetodoPagamento updateManyAndReturn
   */
  export type ReceitaMetodoPagamentoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceitaMetodoPagamento
     */
    select?: ReceitaMetodoPagamentoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ReceitaMetodoPagamento
     */
    omit?: ReceitaMetodoPagamentoOmit<ExtArgs> | null
    /**
     * The data used to update ReceitaMetodoPagamentos.
     */
    data: XOR<ReceitaMetodoPagamentoUpdateManyMutationInput, ReceitaMetodoPagamentoUncheckedUpdateManyInput>
    /**
     * Filter which ReceitaMetodoPagamentos to update
     */
    where?: ReceitaMetodoPagamentoWhereInput
    /**
     * Limit how many ReceitaMetodoPagamentos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceitaMetodoPagamentoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ReceitaMetodoPagamento upsert
   */
  export type ReceitaMetodoPagamentoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceitaMetodoPagamento
     */
    select?: ReceitaMetodoPagamentoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReceitaMetodoPagamento
     */
    omit?: ReceitaMetodoPagamentoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceitaMetodoPagamentoInclude<ExtArgs> | null
    /**
     * The filter to search for the ReceitaMetodoPagamento to update in case it exists.
     */
    where: ReceitaMetodoPagamentoWhereUniqueInput
    /**
     * In case the ReceitaMetodoPagamento found by the `where` argument doesn't exist, create a new ReceitaMetodoPagamento with this data.
     */
    create: XOR<ReceitaMetodoPagamentoCreateInput, ReceitaMetodoPagamentoUncheckedCreateInput>
    /**
     * In case the ReceitaMetodoPagamento was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReceitaMetodoPagamentoUpdateInput, ReceitaMetodoPagamentoUncheckedUpdateInput>
  }

  /**
   * ReceitaMetodoPagamento delete
   */
  export type ReceitaMetodoPagamentoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceitaMetodoPagamento
     */
    select?: ReceitaMetodoPagamentoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReceitaMetodoPagamento
     */
    omit?: ReceitaMetodoPagamentoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceitaMetodoPagamentoInclude<ExtArgs> | null
    /**
     * Filter which ReceitaMetodoPagamento to delete.
     */
    where: ReceitaMetodoPagamentoWhereUniqueInput
  }

  /**
   * ReceitaMetodoPagamento deleteMany
   */
  export type ReceitaMetodoPagamentoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReceitaMetodoPagamentos to delete
     */
    where?: ReceitaMetodoPagamentoWhereInput
    /**
     * Limit how many ReceitaMetodoPagamentos to delete.
     */
    limit?: number
  }

  /**
   * ReceitaMetodoPagamento without action
   */
  export type ReceitaMetodoPagamentoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceitaMetodoPagamento
     */
    select?: ReceitaMetodoPagamentoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReceitaMetodoPagamento
     */
    omit?: ReceitaMetodoPagamentoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceitaMetodoPagamentoInclude<ExtArgs> | null
  }


  /**
   * Model ClientesRecorrentesVsUnicos
   */

  export type AggregateClientesRecorrentesVsUnicos = {
    _count: ClientesRecorrentesVsUnicosCountAggregateOutputType | null
    _avg: ClientesRecorrentesVsUnicosAvgAggregateOutputType | null
    _sum: ClientesRecorrentesVsUnicosSumAggregateOutputType | null
    _min: ClientesRecorrentesVsUnicosMinAggregateOutputType | null
    _max: ClientesRecorrentesVsUnicosMaxAggregateOutputType | null
  }

  export type ClientesRecorrentesVsUnicosAvgAggregateOutputType = {
    quantidade: number | null
  }

  export type ClientesRecorrentesVsUnicosSumAggregateOutputType = {
    quantidade: number | null
  }

  export type ClientesRecorrentesVsUnicosMinAggregateOutputType = {
    id: string | null
    dashboardId: string | null
    tipoCliente: string | null
    quantidade: number | null
  }

  export type ClientesRecorrentesVsUnicosMaxAggregateOutputType = {
    id: string | null
    dashboardId: string | null
    tipoCliente: string | null
    quantidade: number | null
  }

  export type ClientesRecorrentesVsUnicosCountAggregateOutputType = {
    id: number
    dashboardId: number
    tipoCliente: number
    quantidade: number
    _all: number
  }


  export type ClientesRecorrentesVsUnicosAvgAggregateInputType = {
    quantidade?: true
  }

  export type ClientesRecorrentesVsUnicosSumAggregateInputType = {
    quantidade?: true
  }

  export type ClientesRecorrentesVsUnicosMinAggregateInputType = {
    id?: true
    dashboardId?: true
    tipoCliente?: true
    quantidade?: true
  }

  export type ClientesRecorrentesVsUnicosMaxAggregateInputType = {
    id?: true
    dashboardId?: true
    tipoCliente?: true
    quantidade?: true
  }

  export type ClientesRecorrentesVsUnicosCountAggregateInputType = {
    id?: true
    dashboardId?: true
    tipoCliente?: true
    quantidade?: true
    _all?: true
  }

  export type ClientesRecorrentesVsUnicosAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClientesRecorrentesVsUnicos to aggregate.
     */
    where?: ClientesRecorrentesVsUnicosWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClientesRecorrentesVsUnicos to fetch.
     */
    orderBy?: ClientesRecorrentesVsUnicosOrderByWithRelationInput | ClientesRecorrentesVsUnicosOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClientesRecorrentesVsUnicosWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClientesRecorrentesVsUnicos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClientesRecorrentesVsUnicos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ClientesRecorrentesVsUnicos
    **/
    _count?: true | ClientesRecorrentesVsUnicosCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ClientesRecorrentesVsUnicosAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ClientesRecorrentesVsUnicosSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClientesRecorrentesVsUnicosMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClientesRecorrentesVsUnicosMaxAggregateInputType
  }

  export type GetClientesRecorrentesVsUnicosAggregateType<T extends ClientesRecorrentesVsUnicosAggregateArgs> = {
        [P in keyof T & keyof AggregateClientesRecorrentesVsUnicos]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClientesRecorrentesVsUnicos[P]>
      : GetScalarType<T[P], AggregateClientesRecorrentesVsUnicos[P]>
  }




  export type ClientesRecorrentesVsUnicosGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClientesRecorrentesVsUnicosWhereInput
    orderBy?: ClientesRecorrentesVsUnicosOrderByWithAggregationInput | ClientesRecorrentesVsUnicosOrderByWithAggregationInput[]
    by: ClientesRecorrentesVsUnicosScalarFieldEnum[] | ClientesRecorrentesVsUnicosScalarFieldEnum
    having?: ClientesRecorrentesVsUnicosScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClientesRecorrentesVsUnicosCountAggregateInputType | true
    _avg?: ClientesRecorrentesVsUnicosAvgAggregateInputType
    _sum?: ClientesRecorrentesVsUnicosSumAggregateInputType
    _min?: ClientesRecorrentesVsUnicosMinAggregateInputType
    _max?: ClientesRecorrentesVsUnicosMaxAggregateInputType
  }

  export type ClientesRecorrentesVsUnicosGroupByOutputType = {
    id: string
    dashboardId: string
    tipoCliente: string
    quantidade: number
    _count: ClientesRecorrentesVsUnicosCountAggregateOutputType | null
    _avg: ClientesRecorrentesVsUnicosAvgAggregateOutputType | null
    _sum: ClientesRecorrentesVsUnicosSumAggregateOutputType | null
    _min: ClientesRecorrentesVsUnicosMinAggregateOutputType | null
    _max: ClientesRecorrentesVsUnicosMaxAggregateOutputType | null
  }

  type GetClientesRecorrentesVsUnicosGroupByPayload<T extends ClientesRecorrentesVsUnicosGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClientesRecorrentesVsUnicosGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClientesRecorrentesVsUnicosGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClientesRecorrentesVsUnicosGroupByOutputType[P]>
            : GetScalarType<T[P], ClientesRecorrentesVsUnicosGroupByOutputType[P]>
        }
      >
    >


  export type ClientesRecorrentesVsUnicosSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dashboardId?: boolean
    tipoCliente?: boolean
    quantidade?: boolean
    dashboard?: boolean | DashboardComercialDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clientesRecorrentesVsUnicos"]>

  export type ClientesRecorrentesVsUnicosSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dashboardId?: boolean
    tipoCliente?: boolean
    quantidade?: boolean
    dashboard?: boolean | DashboardComercialDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clientesRecorrentesVsUnicos"]>

  export type ClientesRecorrentesVsUnicosSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dashboardId?: boolean
    tipoCliente?: boolean
    quantidade?: boolean
    dashboard?: boolean | DashboardComercialDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clientesRecorrentesVsUnicos"]>

  export type ClientesRecorrentesVsUnicosSelectScalar = {
    id?: boolean
    dashboardId?: boolean
    tipoCliente?: boolean
    quantidade?: boolean
  }

  export type ClientesRecorrentesVsUnicosOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "dashboardId" | "tipoCliente" | "quantidade", ExtArgs["result"]["clientesRecorrentesVsUnicos"]>
  export type ClientesRecorrentesVsUnicosInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dashboard?: boolean | DashboardComercialDefaultArgs<ExtArgs>
  }
  export type ClientesRecorrentesVsUnicosIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dashboard?: boolean | DashboardComercialDefaultArgs<ExtArgs>
  }
  export type ClientesRecorrentesVsUnicosIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dashboard?: boolean | DashboardComercialDefaultArgs<ExtArgs>
  }

  export type $ClientesRecorrentesVsUnicosPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ClientesRecorrentesVsUnicos"
    objects: {
      dashboard: Prisma.$DashboardComercialPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      dashboardId: string
      tipoCliente: string
      quantidade: number
    }, ExtArgs["result"]["clientesRecorrentesVsUnicos"]>
    composites: {}
  }

  type ClientesRecorrentesVsUnicosGetPayload<S extends boolean | null | undefined | ClientesRecorrentesVsUnicosDefaultArgs> = $Result.GetResult<Prisma.$ClientesRecorrentesVsUnicosPayload, S>

  type ClientesRecorrentesVsUnicosCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ClientesRecorrentesVsUnicosFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ClientesRecorrentesVsUnicosCountAggregateInputType | true
    }

  export interface ClientesRecorrentesVsUnicosDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ClientesRecorrentesVsUnicos'], meta: { name: 'ClientesRecorrentesVsUnicos' } }
    /**
     * Find zero or one ClientesRecorrentesVsUnicos that matches the filter.
     * @param {ClientesRecorrentesVsUnicosFindUniqueArgs} args - Arguments to find a ClientesRecorrentesVsUnicos
     * @example
     * // Get one ClientesRecorrentesVsUnicos
     * const clientesRecorrentesVsUnicos = await prisma.clientesRecorrentesVsUnicos.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClientesRecorrentesVsUnicosFindUniqueArgs>(args: SelectSubset<T, ClientesRecorrentesVsUnicosFindUniqueArgs<ExtArgs>>): Prisma__ClientesRecorrentesVsUnicosClient<$Result.GetResult<Prisma.$ClientesRecorrentesVsUnicosPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ClientesRecorrentesVsUnicos that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ClientesRecorrentesVsUnicosFindUniqueOrThrowArgs} args - Arguments to find a ClientesRecorrentesVsUnicos
     * @example
     * // Get one ClientesRecorrentesVsUnicos
     * const clientesRecorrentesVsUnicos = await prisma.clientesRecorrentesVsUnicos.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClientesRecorrentesVsUnicosFindUniqueOrThrowArgs>(args: SelectSubset<T, ClientesRecorrentesVsUnicosFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClientesRecorrentesVsUnicosClient<$Result.GetResult<Prisma.$ClientesRecorrentesVsUnicosPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ClientesRecorrentesVsUnicos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientesRecorrentesVsUnicosFindFirstArgs} args - Arguments to find a ClientesRecorrentesVsUnicos
     * @example
     * // Get one ClientesRecorrentesVsUnicos
     * const clientesRecorrentesVsUnicos = await prisma.clientesRecorrentesVsUnicos.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClientesRecorrentesVsUnicosFindFirstArgs>(args?: SelectSubset<T, ClientesRecorrentesVsUnicosFindFirstArgs<ExtArgs>>): Prisma__ClientesRecorrentesVsUnicosClient<$Result.GetResult<Prisma.$ClientesRecorrentesVsUnicosPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ClientesRecorrentesVsUnicos that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientesRecorrentesVsUnicosFindFirstOrThrowArgs} args - Arguments to find a ClientesRecorrentesVsUnicos
     * @example
     * // Get one ClientesRecorrentesVsUnicos
     * const clientesRecorrentesVsUnicos = await prisma.clientesRecorrentesVsUnicos.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClientesRecorrentesVsUnicosFindFirstOrThrowArgs>(args?: SelectSubset<T, ClientesRecorrentesVsUnicosFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClientesRecorrentesVsUnicosClient<$Result.GetResult<Prisma.$ClientesRecorrentesVsUnicosPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ClientesRecorrentesVsUnicos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientesRecorrentesVsUnicosFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ClientesRecorrentesVsUnicos
     * const clientesRecorrentesVsUnicos = await prisma.clientesRecorrentesVsUnicos.findMany()
     * 
     * // Get first 10 ClientesRecorrentesVsUnicos
     * const clientesRecorrentesVsUnicos = await prisma.clientesRecorrentesVsUnicos.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clientesRecorrentesVsUnicosWithIdOnly = await prisma.clientesRecorrentesVsUnicos.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClientesRecorrentesVsUnicosFindManyArgs>(args?: SelectSubset<T, ClientesRecorrentesVsUnicosFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientesRecorrentesVsUnicosPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ClientesRecorrentesVsUnicos.
     * @param {ClientesRecorrentesVsUnicosCreateArgs} args - Arguments to create a ClientesRecorrentesVsUnicos.
     * @example
     * // Create one ClientesRecorrentesVsUnicos
     * const ClientesRecorrentesVsUnicos = await prisma.clientesRecorrentesVsUnicos.create({
     *   data: {
     *     // ... data to create a ClientesRecorrentesVsUnicos
     *   }
     * })
     * 
     */
    create<T extends ClientesRecorrentesVsUnicosCreateArgs>(args: SelectSubset<T, ClientesRecorrentesVsUnicosCreateArgs<ExtArgs>>): Prisma__ClientesRecorrentesVsUnicosClient<$Result.GetResult<Prisma.$ClientesRecorrentesVsUnicosPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ClientesRecorrentesVsUnicos.
     * @param {ClientesRecorrentesVsUnicosCreateManyArgs} args - Arguments to create many ClientesRecorrentesVsUnicos.
     * @example
     * // Create many ClientesRecorrentesVsUnicos
     * const clientesRecorrentesVsUnicos = await prisma.clientesRecorrentesVsUnicos.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClientesRecorrentesVsUnicosCreateManyArgs>(args?: SelectSubset<T, ClientesRecorrentesVsUnicosCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ClientesRecorrentesVsUnicos and returns the data saved in the database.
     * @param {ClientesRecorrentesVsUnicosCreateManyAndReturnArgs} args - Arguments to create many ClientesRecorrentesVsUnicos.
     * @example
     * // Create many ClientesRecorrentesVsUnicos
     * const clientesRecorrentesVsUnicos = await prisma.clientesRecorrentesVsUnicos.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ClientesRecorrentesVsUnicos and only return the `id`
     * const clientesRecorrentesVsUnicosWithIdOnly = await prisma.clientesRecorrentesVsUnicos.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClientesRecorrentesVsUnicosCreateManyAndReturnArgs>(args?: SelectSubset<T, ClientesRecorrentesVsUnicosCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientesRecorrentesVsUnicosPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ClientesRecorrentesVsUnicos.
     * @param {ClientesRecorrentesVsUnicosDeleteArgs} args - Arguments to delete one ClientesRecorrentesVsUnicos.
     * @example
     * // Delete one ClientesRecorrentesVsUnicos
     * const ClientesRecorrentesVsUnicos = await prisma.clientesRecorrentesVsUnicos.delete({
     *   where: {
     *     // ... filter to delete one ClientesRecorrentesVsUnicos
     *   }
     * })
     * 
     */
    delete<T extends ClientesRecorrentesVsUnicosDeleteArgs>(args: SelectSubset<T, ClientesRecorrentesVsUnicosDeleteArgs<ExtArgs>>): Prisma__ClientesRecorrentesVsUnicosClient<$Result.GetResult<Prisma.$ClientesRecorrentesVsUnicosPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ClientesRecorrentesVsUnicos.
     * @param {ClientesRecorrentesVsUnicosUpdateArgs} args - Arguments to update one ClientesRecorrentesVsUnicos.
     * @example
     * // Update one ClientesRecorrentesVsUnicos
     * const clientesRecorrentesVsUnicos = await prisma.clientesRecorrentesVsUnicos.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClientesRecorrentesVsUnicosUpdateArgs>(args: SelectSubset<T, ClientesRecorrentesVsUnicosUpdateArgs<ExtArgs>>): Prisma__ClientesRecorrentesVsUnicosClient<$Result.GetResult<Prisma.$ClientesRecorrentesVsUnicosPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ClientesRecorrentesVsUnicos.
     * @param {ClientesRecorrentesVsUnicosDeleteManyArgs} args - Arguments to filter ClientesRecorrentesVsUnicos to delete.
     * @example
     * // Delete a few ClientesRecorrentesVsUnicos
     * const { count } = await prisma.clientesRecorrentesVsUnicos.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClientesRecorrentesVsUnicosDeleteManyArgs>(args?: SelectSubset<T, ClientesRecorrentesVsUnicosDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ClientesRecorrentesVsUnicos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientesRecorrentesVsUnicosUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ClientesRecorrentesVsUnicos
     * const clientesRecorrentesVsUnicos = await prisma.clientesRecorrentesVsUnicos.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClientesRecorrentesVsUnicosUpdateManyArgs>(args: SelectSubset<T, ClientesRecorrentesVsUnicosUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ClientesRecorrentesVsUnicos and returns the data updated in the database.
     * @param {ClientesRecorrentesVsUnicosUpdateManyAndReturnArgs} args - Arguments to update many ClientesRecorrentesVsUnicos.
     * @example
     * // Update many ClientesRecorrentesVsUnicos
     * const clientesRecorrentesVsUnicos = await prisma.clientesRecorrentesVsUnicos.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ClientesRecorrentesVsUnicos and only return the `id`
     * const clientesRecorrentesVsUnicosWithIdOnly = await prisma.clientesRecorrentesVsUnicos.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ClientesRecorrentesVsUnicosUpdateManyAndReturnArgs>(args: SelectSubset<T, ClientesRecorrentesVsUnicosUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientesRecorrentesVsUnicosPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ClientesRecorrentesVsUnicos.
     * @param {ClientesRecorrentesVsUnicosUpsertArgs} args - Arguments to update or create a ClientesRecorrentesVsUnicos.
     * @example
     * // Update or create a ClientesRecorrentesVsUnicos
     * const clientesRecorrentesVsUnicos = await prisma.clientesRecorrentesVsUnicos.upsert({
     *   create: {
     *     // ... data to create a ClientesRecorrentesVsUnicos
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ClientesRecorrentesVsUnicos we want to update
     *   }
     * })
     */
    upsert<T extends ClientesRecorrentesVsUnicosUpsertArgs>(args: SelectSubset<T, ClientesRecorrentesVsUnicosUpsertArgs<ExtArgs>>): Prisma__ClientesRecorrentesVsUnicosClient<$Result.GetResult<Prisma.$ClientesRecorrentesVsUnicosPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ClientesRecorrentesVsUnicos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientesRecorrentesVsUnicosCountArgs} args - Arguments to filter ClientesRecorrentesVsUnicos to count.
     * @example
     * // Count the number of ClientesRecorrentesVsUnicos
     * const count = await prisma.clientesRecorrentesVsUnicos.count({
     *   where: {
     *     // ... the filter for the ClientesRecorrentesVsUnicos we want to count
     *   }
     * })
    **/
    count<T extends ClientesRecorrentesVsUnicosCountArgs>(
      args?: Subset<T, ClientesRecorrentesVsUnicosCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClientesRecorrentesVsUnicosCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ClientesRecorrentesVsUnicos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientesRecorrentesVsUnicosAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClientesRecorrentesVsUnicosAggregateArgs>(args: Subset<T, ClientesRecorrentesVsUnicosAggregateArgs>): Prisma.PrismaPromise<GetClientesRecorrentesVsUnicosAggregateType<T>>

    /**
     * Group by ClientesRecorrentesVsUnicos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientesRecorrentesVsUnicosGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ClientesRecorrentesVsUnicosGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClientesRecorrentesVsUnicosGroupByArgs['orderBy'] }
        : { orderBy?: ClientesRecorrentesVsUnicosGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ClientesRecorrentesVsUnicosGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClientesRecorrentesVsUnicosGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ClientesRecorrentesVsUnicos model
   */
  readonly fields: ClientesRecorrentesVsUnicosFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ClientesRecorrentesVsUnicos.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClientesRecorrentesVsUnicosClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    dashboard<T extends DashboardComercialDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DashboardComercialDefaultArgs<ExtArgs>>): Prisma__DashboardComercialClient<$Result.GetResult<Prisma.$DashboardComercialPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ClientesRecorrentesVsUnicos model
   */
  interface ClientesRecorrentesVsUnicosFieldRefs {
    readonly id: FieldRef<"ClientesRecorrentesVsUnicos", 'String'>
    readonly dashboardId: FieldRef<"ClientesRecorrentesVsUnicos", 'String'>
    readonly tipoCliente: FieldRef<"ClientesRecorrentesVsUnicos", 'String'>
    readonly quantidade: FieldRef<"ClientesRecorrentesVsUnicos", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * ClientesRecorrentesVsUnicos findUnique
   */
  export type ClientesRecorrentesVsUnicosFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientesRecorrentesVsUnicos
     */
    select?: ClientesRecorrentesVsUnicosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClientesRecorrentesVsUnicos
     */
    omit?: ClientesRecorrentesVsUnicosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientesRecorrentesVsUnicosInclude<ExtArgs> | null
    /**
     * Filter, which ClientesRecorrentesVsUnicos to fetch.
     */
    where: ClientesRecorrentesVsUnicosWhereUniqueInput
  }

  /**
   * ClientesRecorrentesVsUnicos findUniqueOrThrow
   */
  export type ClientesRecorrentesVsUnicosFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientesRecorrentesVsUnicos
     */
    select?: ClientesRecorrentesVsUnicosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClientesRecorrentesVsUnicos
     */
    omit?: ClientesRecorrentesVsUnicosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientesRecorrentesVsUnicosInclude<ExtArgs> | null
    /**
     * Filter, which ClientesRecorrentesVsUnicos to fetch.
     */
    where: ClientesRecorrentesVsUnicosWhereUniqueInput
  }

  /**
   * ClientesRecorrentesVsUnicos findFirst
   */
  export type ClientesRecorrentesVsUnicosFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientesRecorrentesVsUnicos
     */
    select?: ClientesRecorrentesVsUnicosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClientesRecorrentesVsUnicos
     */
    omit?: ClientesRecorrentesVsUnicosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientesRecorrentesVsUnicosInclude<ExtArgs> | null
    /**
     * Filter, which ClientesRecorrentesVsUnicos to fetch.
     */
    where?: ClientesRecorrentesVsUnicosWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClientesRecorrentesVsUnicos to fetch.
     */
    orderBy?: ClientesRecorrentesVsUnicosOrderByWithRelationInput | ClientesRecorrentesVsUnicosOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClientesRecorrentesVsUnicos.
     */
    cursor?: ClientesRecorrentesVsUnicosWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClientesRecorrentesVsUnicos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClientesRecorrentesVsUnicos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClientesRecorrentesVsUnicos.
     */
    distinct?: ClientesRecorrentesVsUnicosScalarFieldEnum | ClientesRecorrentesVsUnicosScalarFieldEnum[]
  }

  /**
   * ClientesRecorrentesVsUnicos findFirstOrThrow
   */
  export type ClientesRecorrentesVsUnicosFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientesRecorrentesVsUnicos
     */
    select?: ClientesRecorrentesVsUnicosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClientesRecorrentesVsUnicos
     */
    omit?: ClientesRecorrentesVsUnicosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientesRecorrentesVsUnicosInclude<ExtArgs> | null
    /**
     * Filter, which ClientesRecorrentesVsUnicos to fetch.
     */
    where?: ClientesRecorrentesVsUnicosWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClientesRecorrentesVsUnicos to fetch.
     */
    orderBy?: ClientesRecorrentesVsUnicosOrderByWithRelationInput | ClientesRecorrentesVsUnicosOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClientesRecorrentesVsUnicos.
     */
    cursor?: ClientesRecorrentesVsUnicosWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClientesRecorrentesVsUnicos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClientesRecorrentesVsUnicos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClientesRecorrentesVsUnicos.
     */
    distinct?: ClientesRecorrentesVsUnicosScalarFieldEnum | ClientesRecorrentesVsUnicosScalarFieldEnum[]
  }

  /**
   * ClientesRecorrentesVsUnicos findMany
   */
  export type ClientesRecorrentesVsUnicosFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientesRecorrentesVsUnicos
     */
    select?: ClientesRecorrentesVsUnicosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClientesRecorrentesVsUnicos
     */
    omit?: ClientesRecorrentesVsUnicosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientesRecorrentesVsUnicosInclude<ExtArgs> | null
    /**
     * Filter, which ClientesRecorrentesVsUnicos to fetch.
     */
    where?: ClientesRecorrentesVsUnicosWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClientesRecorrentesVsUnicos to fetch.
     */
    orderBy?: ClientesRecorrentesVsUnicosOrderByWithRelationInput | ClientesRecorrentesVsUnicosOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ClientesRecorrentesVsUnicos.
     */
    cursor?: ClientesRecorrentesVsUnicosWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClientesRecorrentesVsUnicos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClientesRecorrentesVsUnicos.
     */
    skip?: number
    distinct?: ClientesRecorrentesVsUnicosScalarFieldEnum | ClientesRecorrentesVsUnicosScalarFieldEnum[]
  }

  /**
   * ClientesRecorrentesVsUnicos create
   */
  export type ClientesRecorrentesVsUnicosCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientesRecorrentesVsUnicos
     */
    select?: ClientesRecorrentesVsUnicosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClientesRecorrentesVsUnicos
     */
    omit?: ClientesRecorrentesVsUnicosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientesRecorrentesVsUnicosInclude<ExtArgs> | null
    /**
     * The data needed to create a ClientesRecorrentesVsUnicos.
     */
    data: XOR<ClientesRecorrentesVsUnicosCreateInput, ClientesRecorrentesVsUnicosUncheckedCreateInput>
  }

  /**
   * ClientesRecorrentesVsUnicos createMany
   */
  export type ClientesRecorrentesVsUnicosCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ClientesRecorrentesVsUnicos.
     */
    data: ClientesRecorrentesVsUnicosCreateManyInput | ClientesRecorrentesVsUnicosCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ClientesRecorrentesVsUnicos createManyAndReturn
   */
  export type ClientesRecorrentesVsUnicosCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientesRecorrentesVsUnicos
     */
    select?: ClientesRecorrentesVsUnicosSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ClientesRecorrentesVsUnicos
     */
    omit?: ClientesRecorrentesVsUnicosOmit<ExtArgs> | null
    /**
     * The data used to create many ClientesRecorrentesVsUnicos.
     */
    data: ClientesRecorrentesVsUnicosCreateManyInput | ClientesRecorrentesVsUnicosCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientesRecorrentesVsUnicosIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ClientesRecorrentesVsUnicos update
   */
  export type ClientesRecorrentesVsUnicosUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientesRecorrentesVsUnicos
     */
    select?: ClientesRecorrentesVsUnicosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClientesRecorrentesVsUnicos
     */
    omit?: ClientesRecorrentesVsUnicosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientesRecorrentesVsUnicosInclude<ExtArgs> | null
    /**
     * The data needed to update a ClientesRecorrentesVsUnicos.
     */
    data: XOR<ClientesRecorrentesVsUnicosUpdateInput, ClientesRecorrentesVsUnicosUncheckedUpdateInput>
    /**
     * Choose, which ClientesRecorrentesVsUnicos to update.
     */
    where: ClientesRecorrentesVsUnicosWhereUniqueInput
  }

  /**
   * ClientesRecorrentesVsUnicos updateMany
   */
  export type ClientesRecorrentesVsUnicosUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ClientesRecorrentesVsUnicos.
     */
    data: XOR<ClientesRecorrentesVsUnicosUpdateManyMutationInput, ClientesRecorrentesVsUnicosUncheckedUpdateManyInput>
    /**
     * Filter which ClientesRecorrentesVsUnicos to update
     */
    where?: ClientesRecorrentesVsUnicosWhereInput
    /**
     * Limit how many ClientesRecorrentesVsUnicos to update.
     */
    limit?: number
  }

  /**
   * ClientesRecorrentesVsUnicos updateManyAndReturn
   */
  export type ClientesRecorrentesVsUnicosUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientesRecorrentesVsUnicos
     */
    select?: ClientesRecorrentesVsUnicosSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ClientesRecorrentesVsUnicos
     */
    omit?: ClientesRecorrentesVsUnicosOmit<ExtArgs> | null
    /**
     * The data used to update ClientesRecorrentesVsUnicos.
     */
    data: XOR<ClientesRecorrentesVsUnicosUpdateManyMutationInput, ClientesRecorrentesVsUnicosUncheckedUpdateManyInput>
    /**
     * Filter which ClientesRecorrentesVsUnicos to update
     */
    where?: ClientesRecorrentesVsUnicosWhereInput
    /**
     * Limit how many ClientesRecorrentesVsUnicos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientesRecorrentesVsUnicosIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ClientesRecorrentesVsUnicos upsert
   */
  export type ClientesRecorrentesVsUnicosUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientesRecorrentesVsUnicos
     */
    select?: ClientesRecorrentesVsUnicosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClientesRecorrentesVsUnicos
     */
    omit?: ClientesRecorrentesVsUnicosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientesRecorrentesVsUnicosInclude<ExtArgs> | null
    /**
     * The filter to search for the ClientesRecorrentesVsUnicos to update in case it exists.
     */
    where: ClientesRecorrentesVsUnicosWhereUniqueInput
    /**
     * In case the ClientesRecorrentesVsUnicos found by the `where` argument doesn't exist, create a new ClientesRecorrentesVsUnicos with this data.
     */
    create: XOR<ClientesRecorrentesVsUnicosCreateInput, ClientesRecorrentesVsUnicosUncheckedCreateInput>
    /**
     * In case the ClientesRecorrentesVsUnicos was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClientesRecorrentesVsUnicosUpdateInput, ClientesRecorrentesVsUnicosUncheckedUpdateInput>
  }

  /**
   * ClientesRecorrentesVsUnicos delete
   */
  export type ClientesRecorrentesVsUnicosDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientesRecorrentesVsUnicos
     */
    select?: ClientesRecorrentesVsUnicosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClientesRecorrentesVsUnicos
     */
    omit?: ClientesRecorrentesVsUnicosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientesRecorrentesVsUnicosInclude<ExtArgs> | null
    /**
     * Filter which ClientesRecorrentesVsUnicos to delete.
     */
    where: ClientesRecorrentesVsUnicosWhereUniqueInput
  }

  /**
   * ClientesRecorrentesVsUnicos deleteMany
   */
  export type ClientesRecorrentesVsUnicosDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClientesRecorrentesVsUnicos to delete
     */
    where?: ClientesRecorrentesVsUnicosWhereInput
    /**
     * Limit how many ClientesRecorrentesVsUnicos to delete.
     */
    limit?: number
  }

  /**
   * ClientesRecorrentesVsUnicos without action
   */
  export type ClientesRecorrentesVsUnicosDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientesRecorrentesVsUnicos
     */
    select?: ClientesRecorrentesVsUnicosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClientesRecorrentesVsUnicos
     */
    omit?: ClientesRecorrentesVsUnicosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientesRecorrentesVsUnicosInclude<ExtArgs> | null
  }


  /**
   * Model ProdutoRank
   */

  export type AggregateProdutoRank = {
    _count: ProdutoRankCountAggregateOutputType | null
    _avg: ProdutoRankAvgAggregateOutputType | null
    _sum: ProdutoRankSumAggregateOutputType | null
    _min: ProdutoRankMinAggregateOutputType | null
    _max: ProdutoRankMaxAggregateOutputType | null
  }

  export type ProdutoRankAvgAggregateOutputType = {
    vendas: number | null
  }

  export type ProdutoRankSumAggregateOutputType = {
    vendas: number | null
  }

  export type ProdutoRankMinAggregateOutputType = {
    id: string | null
    dashboardId: string | null
    produto: string | null
    vendas: number | null
  }

  export type ProdutoRankMaxAggregateOutputType = {
    id: string | null
    dashboardId: string | null
    produto: string | null
    vendas: number | null
  }

  export type ProdutoRankCountAggregateOutputType = {
    id: number
    dashboardId: number
    produto: number
    vendas: number
    _all: number
  }


  export type ProdutoRankAvgAggregateInputType = {
    vendas?: true
  }

  export type ProdutoRankSumAggregateInputType = {
    vendas?: true
  }

  export type ProdutoRankMinAggregateInputType = {
    id?: true
    dashboardId?: true
    produto?: true
    vendas?: true
  }

  export type ProdutoRankMaxAggregateInputType = {
    id?: true
    dashboardId?: true
    produto?: true
    vendas?: true
  }

  export type ProdutoRankCountAggregateInputType = {
    id?: true
    dashboardId?: true
    produto?: true
    vendas?: true
    _all?: true
  }

  export type ProdutoRankAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProdutoRank to aggregate.
     */
    where?: ProdutoRankWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProdutoRanks to fetch.
     */
    orderBy?: ProdutoRankOrderByWithRelationInput | ProdutoRankOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProdutoRankWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProdutoRanks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProdutoRanks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProdutoRanks
    **/
    _count?: true | ProdutoRankCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProdutoRankAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProdutoRankSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProdutoRankMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProdutoRankMaxAggregateInputType
  }

  export type GetProdutoRankAggregateType<T extends ProdutoRankAggregateArgs> = {
        [P in keyof T & keyof AggregateProdutoRank]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProdutoRank[P]>
      : GetScalarType<T[P], AggregateProdutoRank[P]>
  }




  export type ProdutoRankGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProdutoRankWhereInput
    orderBy?: ProdutoRankOrderByWithAggregationInput | ProdutoRankOrderByWithAggregationInput[]
    by: ProdutoRankScalarFieldEnum[] | ProdutoRankScalarFieldEnum
    having?: ProdutoRankScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProdutoRankCountAggregateInputType | true
    _avg?: ProdutoRankAvgAggregateInputType
    _sum?: ProdutoRankSumAggregateInputType
    _min?: ProdutoRankMinAggregateInputType
    _max?: ProdutoRankMaxAggregateInputType
  }

  export type ProdutoRankGroupByOutputType = {
    id: string
    dashboardId: string
    produto: string
    vendas: number
    _count: ProdutoRankCountAggregateOutputType | null
    _avg: ProdutoRankAvgAggregateOutputType | null
    _sum: ProdutoRankSumAggregateOutputType | null
    _min: ProdutoRankMinAggregateOutputType | null
    _max: ProdutoRankMaxAggregateOutputType | null
  }

  type GetProdutoRankGroupByPayload<T extends ProdutoRankGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProdutoRankGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProdutoRankGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProdutoRankGroupByOutputType[P]>
            : GetScalarType<T[P], ProdutoRankGroupByOutputType[P]>
        }
      >
    >


  export type ProdutoRankSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dashboardId?: boolean
    produto?: boolean
    vendas?: boolean
    dashboard?: boolean | DashboardComercialDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["produtoRank"]>

  export type ProdutoRankSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dashboardId?: boolean
    produto?: boolean
    vendas?: boolean
    dashboard?: boolean | DashboardComercialDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["produtoRank"]>

  export type ProdutoRankSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dashboardId?: boolean
    produto?: boolean
    vendas?: boolean
    dashboard?: boolean | DashboardComercialDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["produtoRank"]>

  export type ProdutoRankSelectScalar = {
    id?: boolean
    dashboardId?: boolean
    produto?: boolean
    vendas?: boolean
  }

  export type ProdutoRankOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "dashboardId" | "produto" | "vendas", ExtArgs["result"]["produtoRank"]>
  export type ProdutoRankInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dashboard?: boolean | DashboardComercialDefaultArgs<ExtArgs>
  }
  export type ProdutoRankIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dashboard?: boolean | DashboardComercialDefaultArgs<ExtArgs>
  }
  export type ProdutoRankIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dashboard?: boolean | DashboardComercialDefaultArgs<ExtArgs>
  }

  export type $ProdutoRankPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProdutoRank"
    objects: {
      dashboard: Prisma.$DashboardComercialPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      dashboardId: string
      produto: string
      vendas: number
    }, ExtArgs["result"]["produtoRank"]>
    composites: {}
  }

  type ProdutoRankGetPayload<S extends boolean | null | undefined | ProdutoRankDefaultArgs> = $Result.GetResult<Prisma.$ProdutoRankPayload, S>

  type ProdutoRankCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProdutoRankFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProdutoRankCountAggregateInputType | true
    }

  export interface ProdutoRankDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProdutoRank'], meta: { name: 'ProdutoRank' } }
    /**
     * Find zero or one ProdutoRank that matches the filter.
     * @param {ProdutoRankFindUniqueArgs} args - Arguments to find a ProdutoRank
     * @example
     * // Get one ProdutoRank
     * const produtoRank = await prisma.produtoRank.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProdutoRankFindUniqueArgs>(args: SelectSubset<T, ProdutoRankFindUniqueArgs<ExtArgs>>): Prisma__ProdutoRankClient<$Result.GetResult<Prisma.$ProdutoRankPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProdutoRank that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProdutoRankFindUniqueOrThrowArgs} args - Arguments to find a ProdutoRank
     * @example
     * // Get one ProdutoRank
     * const produtoRank = await prisma.produtoRank.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProdutoRankFindUniqueOrThrowArgs>(args: SelectSubset<T, ProdutoRankFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProdutoRankClient<$Result.GetResult<Prisma.$ProdutoRankPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProdutoRank that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProdutoRankFindFirstArgs} args - Arguments to find a ProdutoRank
     * @example
     * // Get one ProdutoRank
     * const produtoRank = await prisma.produtoRank.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProdutoRankFindFirstArgs>(args?: SelectSubset<T, ProdutoRankFindFirstArgs<ExtArgs>>): Prisma__ProdutoRankClient<$Result.GetResult<Prisma.$ProdutoRankPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProdutoRank that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProdutoRankFindFirstOrThrowArgs} args - Arguments to find a ProdutoRank
     * @example
     * // Get one ProdutoRank
     * const produtoRank = await prisma.produtoRank.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProdutoRankFindFirstOrThrowArgs>(args?: SelectSubset<T, ProdutoRankFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProdutoRankClient<$Result.GetResult<Prisma.$ProdutoRankPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProdutoRanks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProdutoRankFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProdutoRanks
     * const produtoRanks = await prisma.produtoRank.findMany()
     * 
     * // Get first 10 ProdutoRanks
     * const produtoRanks = await prisma.produtoRank.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const produtoRankWithIdOnly = await prisma.produtoRank.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProdutoRankFindManyArgs>(args?: SelectSubset<T, ProdutoRankFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProdutoRankPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProdutoRank.
     * @param {ProdutoRankCreateArgs} args - Arguments to create a ProdutoRank.
     * @example
     * // Create one ProdutoRank
     * const ProdutoRank = await prisma.produtoRank.create({
     *   data: {
     *     // ... data to create a ProdutoRank
     *   }
     * })
     * 
     */
    create<T extends ProdutoRankCreateArgs>(args: SelectSubset<T, ProdutoRankCreateArgs<ExtArgs>>): Prisma__ProdutoRankClient<$Result.GetResult<Prisma.$ProdutoRankPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProdutoRanks.
     * @param {ProdutoRankCreateManyArgs} args - Arguments to create many ProdutoRanks.
     * @example
     * // Create many ProdutoRanks
     * const produtoRank = await prisma.produtoRank.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProdutoRankCreateManyArgs>(args?: SelectSubset<T, ProdutoRankCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProdutoRanks and returns the data saved in the database.
     * @param {ProdutoRankCreateManyAndReturnArgs} args - Arguments to create many ProdutoRanks.
     * @example
     * // Create many ProdutoRanks
     * const produtoRank = await prisma.produtoRank.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProdutoRanks and only return the `id`
     * const produtoRankWithIdOnly = await prisma.produtoRank.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProdutoRankCreateManyAndReturnArgs>(args?: SelectSubset<T, ProdutoRankCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProdutoRankPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProdutoRank.
     * @param {ProdutoRankDeleteArgs} args - Arguments to delete one ProdutoRank.
     * @example
     * // Delete one ProdutoRank
     * const ProdutoRank = await prisma.produtoRank.delete({
     *   where: {
     *     // ... filter to delete one ProdutoRank
     *   }
     * })
     * 
     */
    delete<T extends ProdutoRankDeleteArgs>(args: SelectSubset<T, ProdutoRankDeleteArgs<ExtArgs>>): Prisma__ProdutoRankClient<$Result.GetResult<Prisma.$ProdutoRankPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProdutoRank.
     * @param {ProdutoRankUpdateArgs} args - Arguments to update one ProdutoRank.
     * @example
     * // Update one ProdutoRank
     * const produtoRank = await prisma.produtoRank.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProdutoRankUpdateArgs>(args: SelectSubset<T, ProdutoRankUpdateArgs<ExtArgs>>): Prisma__ProdutoRankClient<$Result.GetResult<Prisma.$ProdutoRankPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProdutoRanks.
     * @param {ProdutoRankDeleteManyArgs} args - Arguments to filter ProdutoRanks to delete.
     * @example
     * // Delete a few ProdutoRanks
     * const { count } = await prisma.produtoRank.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProdutoRankDeleteManyArgs>(args?: SelectSubset<T, ProdutoRankDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProdutoRanks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProdutoRankUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProdutoRanks
     * const produtoRank = await prisma.produtoRank.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProdutoRankUpdateManyArgs>(args: SelectSubset<T, ProdutoRankUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProdutoRanks and returns the data updated in the database.
     * @param {ProdutoRankUpdateManyAndReturnArgs} args - Arguments to update many ProdutoRanks.
     * @example
     * // Update many ProdutoRanks
     * const produtoRank = await prisma.produtoRank.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProdutoRanks and only return the `id`
     * const produtoRankWithIdOnly = await prisma.produtoRank.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProdutoRankUpdateManyAndReturnArgs>(args: SelectSubset<T, ProdutoRankUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProdutoRankPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProdutoRank.
     * @param {ProdutoRankUpsertArgs} args - Arguments to update or create a ProdutoRank.
     * @example
     * // Update or create a ProdutoRank
     * const produtoRank = await prisma.produtoRank.upsert({
     *   create: {
     *     // ... data to create a ProdutoRank
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProdutoRank we want to update
     *   }
     * })
     */
    upsert<T extends ProdutoRankUpsertArgs>(args: SelectSubset<T, ProdutoRankUpsertArgs<ExtArgs>>): Prisma__ProdutoRankClient<$Result.GetResult<Prisma.$ProdutoRankPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProdutoRanks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProdutoRankCountArgs} args - Arguments to filter ProdutoRanks to count.
     * @example
     * // Count the number of ProdutoRanks
     * const count = await prisma.produtoRank.count({
     *   where: {
     *     // ... the filter for the ProdutoRanks we want to count
     *   }
     * })
    **/
    count<T extends ProdutoRankCountArgs>(
      args?: Subset<T, ProdutoRankCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProdutoRankCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProdutoRank.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProdutoRankAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProdutoRankAggregateArgs>(args: Subset<T, ProdutoRankAggregateArgs>): Prisma.PrismaPromise<GetProdutoRankAggregateType<T>>

    /**
     * Group by ProdutoRank.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProdutoRankGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProdutoRankGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProdutoRankGroupByArgs['orderBy'] }
        : { orderBy?: ProdutoRankGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProdutoRankGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProdutoRankGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProdutoRank model
   */
  readonly fields: ProdutoRankFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProdutoRank.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProdutoRankClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    dashboard<T extends DashboardComercialDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DashboardComercialDefaultArgs<ExtArgs>>): Prisma__DashboardComercialClient<$Result.GetResult<Prisma.$DashboardComercialPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProdutoRank model
   */
  interface ProdutoRankFieldRefs {
    readonly id: FieldRef<"ProdutoRank", 'String'>
    readonly dashboardId: FieldRef<"ProdutoRank", 'String'>
    readonly produto: FieldRef<"ProdutoRank", 'String'>
    readonly vendas: FieldRef<"ProdutoRank", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * ProdutoRank findUnique
   */
  export type ProdutoRankFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProdutoRank
     */
    select?: ProdutoRankSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProdutoRank
     */
    omit?: ProdutoRankOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProdutoRankInclude<ExtArgs> | null
    /**
     * Filter, which ProdutoRank to fetch.
     */
    where: ProdutoRankWhereUniqueInput
  }

  /**
   * ProdutoRank findUniqueOrThrow
   */
  export type ProdutoRankFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProdutoRank
     */
    select?: ProdutoRankSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProdutoRank
     */
    omit?: ProdutoRankOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProdutoRankInclude<ExtArgs> | null
    /**
     * Filter, which ProdutoRank to fetch.
     */
    where: ProdutoRankWhereUniqueInput
  }

  /**
   * ProdutoRank findFirst
   */
  export type ProdutoRankFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProdutoRank
     */
    select?: ProdutoRankSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProdutoRank
     */
    omit?: ProdutoRankOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProdutoRankInclude<ExtArgs> | null
    /**
     * Filter, which ProdutoRank to fetch.
     */
    where?: ProdutoRankWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProdutoRanks to fetch.
     */
    orderBy?: ProdutoRankOrderByWithRelationInput | ProdutoRankOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProdutoRanks.
     */
    cursor?: ProdutoRankWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProdutoRanks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProdutoRanks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProdutoRanks.
     */
    distinct?: ProdutoRankScalarFieldEnum | ProdutoRankScalarFieldEnum[]
  }

  /**
   * ProdutoRank findFirstOrThrow
   */
  export type ProdutoRankFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProdutoRank
     */
    select?: ProdutoRankSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProdutoRank
     */
    omit?: ProdutoRankOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProdutoRankInclude<ExtArgs> | null
    /**
     * Filter, which ProdutoRank to fetch.
     */
    where?: ProdutoRankWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProdutoRanks to fetch.
     */
    orderBy?: ProdutoRankOrderByWithRelationInput | ProdutoRankOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProdutoRanks.
     */
    cursor?: ProdutoRankWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProdutoRanks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProdutoRanks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProdutoRanks.
     */
    distinct?: ProdutoRankScalarFieldEnum | ProdutoRankScalarFieldEnum[]
  }

  /**
   * ProdutoRank findMany
   */
  export type ProdutoRankFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProdutoRank
     */
    select?: ProdutoRankSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProdutoRank
     */
    omit?: ProdutoRankOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProdutoRankInclude<ExtArgs> | null
    /**
     * Filter, which ProdutoRanks to fetch.
     */
    where?: ProdutoRankWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProdutoRanks to fetch.
     */
    orderBy?: ProdutoRankOrderByWithRelationInput | ProdutoRankOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProdutoRanks.
     */
    cursor?: ProdutoRankWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProdutoRanks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProdutoRanks.
     */
    skip?: number
    distinct?: ProdutoRankScalarFieldEnum | ProdutoRankScalarFieldEnum[]
  }

  /**
   * ProdutoRank create
   */
  export type ProdutoRankCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProdutoRank
     */
    select?: ProdutoRankSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProdutoRank
     */
    omit?: ProdutoRankOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProdutoRankInclude<ExtArgs> | null
    /**
     * The data needed to create a ProdutoRank.
     */
    data: XOR<ProdutoRankCreateInput, ProdutoRankUncheckedCreateInput>
  }

  /**
   * ProdutoRank createMany
   */
  export type ProdutoRankCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProdutoRanks.
     */
    data: ProdutoRankCreateManyInput | ProdutoRankCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProdutoRank createManyAndReturn
   */
  export type ProdutoRankCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProdutoRank
     */
    select?: ProdutoRankSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProdutoRank
     */
    omit?: ProdutoRankOmit<ExtArgs> | null
    /**
     * The data used to create many ProdutoRanks.
     */
    data: ProdutoRankCreateManyInput | ProdutoRankCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProdutoRankIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProdutoRank update
   */
  export type ProdutoRankUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProdutoRank
     */
    select?: ProdutoRankSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProdutoRank
     */
    omit?: ProdutoRankOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProdutoRankInclude<ExtArgs> | null
    /**
     * The data needed to update a ProdutoRank.
     */
    data: XOR<ProdutoRankUpdateInput, ProdutoRankUncheckedUpdateInput>
    /**
     * Choose, which ProdutoRank to update.
     */
    where: ProdutoRankWhereUniqueInput
  }

  /**
   * ProdutoRank updateMany
   */
  export type ProdutoRankUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProdutoRanks.
     */
    data: XOR<ProdutoRankUpdateManyMutationInput, ProdutoRankUncheckedUpdateManyInput>
    /**
     * Filter which ProdutoRanks to update
     */
    where?: ProdutoRankWhereInput
    /**
     * Limit how many ProdutoRanks to update.
     */
    limit?: number
  }

  /**
   * ProdutoRank updateManyAndReturn
   */
  export type ProdutoRankUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProdutoRank
     */
    select?: ProdutoRankSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProdutoRank
     */
    omit?: ProdutoRankOmit<ExtArgs> | null
    /**
     * The data used to update ProdutoRanks.
     */
    data: XOR<ProdutoRankUpdateManyMutationInput, ProdutoRankUncheckedUpdateManyInput>
    /**
     * Filter which ProdutoRanks to update
     */
    where?: ProdutoRankWhereInput
    /**
     * Limit how many ProdutoRanks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProdutoRankIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProdutoRank upsert
   */
  export type ProdutoRankUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProdutoRank
     */
    select?: ProdutoRankSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProdutoRank
     */
    omit?: ProdutoRankOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProdutoRankInclude<ExtArgs> | null
    /**
     * The filter to search for the ProdutoRank to update in case it exists.
     */
    where: ProdutoRankWhereUniqueInput
    /**
     * In case the ProdutoRank found by the `where` argument doesn't exist, create a new ProdutoRank with this data.
     */
    create: XOR<ProdutoRankCreateInput, ProdutoRankUncheckedCreateInput>
    /**
     * In case the ProdutoRank was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProdutoRankUpdateInput, ProdutoRankUncheckedUpdateInput>
  }

  /**
   * ProdutoRank delete
   */
  export type ProdutoRankDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProdutoRank
     */
    select?: ProdutoRankSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProdutoRank
     */
    omit?: ProdutoRankOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProdutoRankInclude<ExtArgs> | null
    /**
     * Filter which ProdutoRank to delete.
     */
    where: ProdutoRankWhereUniqueInput
  }

  /**
   * ProdutoRank deleteMany
   */
  export type ProdutoRankDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProdutoRanks to delete
     */
    where?: ProdutoRankWhereInput
    /**
     * Limit how many ProdutoRanks to delete.
     */
    limit?: number
  }

  /**
   * ProdutoRank without action
   */
  export type ProdutoRankDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProdutoRank
     */
    select?: ProdutoRankSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProdutoRank
     */
    omit?: ProdutoRankOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProdutoRankInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const OrganizationScalarFieldEnum: {
    id: 'id',
    name: 'name',
    googleAccessToken: 'googleAccessToken',
    googleRefreshToken: 'googleRefreshToken',
    googleScopes: 'googleScopes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    googleExpiresIn: 'googleExpiresIn'
  };

  export type OrganizationScalarFieldEnum = (typeof OrganizationScalarFieldEnum)[keyof typeof OrganizationScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    password: 'password',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    organizationId: 'organizationId'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const PedidoScalarFieldEnum: {
    id: 'id',
    dataPedido: 'dataPedido',
    dataAprovacao: 'dataAprovacao',
    cancelada: 'cancelada',
    faturado: 'faturado',
    codigoPedido: 'codigoPedido',
    codigoProduto: 'codigoProduto',
    setor: 'setor',
    produto: 'produto',
    precoUnitario: 'precoUnitario',
    quantidade: 'quantidade',
    valorTotal: 'valorTotal',
    cliente: 'cliente',
    vendedor: 'vendedor'
  };

  export type PedidoScalarFieldEnum = (typeof PedidoScalarFieldEnum)[keyof typeof PedidoScalarFieldEnum]


  export const DashboardMarketingScalarFieldEnum: {
    id: 'id',
    organizationId: 'organizationId',
    sessoes: 'sessoes',
    usuarios: 'usuarios',
    taxaRejeicao: 'taxaRejeicao',
    taxaConversaoSite: 'taxaConversaoSite',
    taxaAbandonoCarrinho: 'taxaAbandonoCarrinho',
    impressoes: 'impressoes',
    cliques: 'cliques',
    ctr: 'ctr',
    cpc: 'cpc',
    conversoes: 'conversoes',
    custoPorConversao: 'custoPorConversao',
    roas: 'roas',
    custoPorLead: 'custoPorLead',
    faturamentoTotal: 'faturamentoTotal',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DashboardMarketingScalarFieldEnum = (typeof DashboardMarketingScalarFieldEnum)[keyof typeof DashboardMarketingScalarFieldEnum]


  export const TrafegoScalarFieldEnum: {
    id: 'id',
    dashboardId: 'dashboardId',
    origem: 'origem',
    valor: 'valor'
  };

  export type TrafegoScalarFieldEnum = (typeof TrafegoScalarFieldEnum)[keyof typeof TrafegoScalarFieldEnum]


  export const CanalTrafegoScalarFieldEnum: {
    id: 'id',
    dashboardId: 'dashboardId',
    canal: 'canal',
    taxaConversao: 'taxaConversao',
    cpa: 'cpa',
    roi: 'roi'
  };

  export type CanalTrafegoScalarFieldEnum = (typeof CanalTrafegoScalarFieldEnum)[keyof typeof CanalTrafegoScalarFieldEnum]


  export const AnuncioCTRScalarFieldEnum: {
    id: 'id',
    dashboardId: 'dashboardId',
    nome: 'nome',
    ctr: 'ctr'
  };

  export type AnuncioCTRScalarFieldEnum = (typeof AnuncioCTRScalarFieldEnum)[keyof typeof AnuncioCTRScalarFieldEnum]


  export const AnuncioConversaoScalarFieldEnum: {
    id: 'id',
    dashboardId: 'dashboardId',
    nome: 'nome',
    conversoes: 'conversoes'
  };

  export type AnuncioConversaoScalarFieldEnum = (typeof AnuncioConversaoScalarFieldEnum)[keyof typeof AnuncioConversaoScalarFieldEnum]


  export const PalavraChaveScalarFieldEnum: {
    id: 'id',
    dashboardId: 'dashboardId',
    palavra: 'palavra',
    ctr: 'ctr'
  };

  export type PalavraChaveScalarFieldEnum = (typeof PalavraChaveScalarFieldEnum)[keyof typeof PalavraChaveScalarFieldEnum]


  export const DashboardComercialScalarFieldEnum: {
    id: 'id',
    organizationId: 'organizationId',
    receitaTotal: 'receitaTotal',
    ticketMedio: 'ticketMedio',
    crescimentoReceita: 'crescimentoReceita',
    novosClientes: 'novosClientes',
    taxaRetencaoClientes: 'taxaRetencaoClientes',
    clv: 'clv',
    volumeReparos: 'volumeReparos',
    taxaReincidenciaReparos: 'taxaReincidenciaReparos',
    receitaReparosVsVendas: 'receitaReparosVsVendas',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DashboardComercialScalarFieldEnum = (typeof DashboardComercialScalarFieldEnum)[keyof typeof DashboardComercialScalarFieldEnum]


  export const ReceitaCategoriaScalarFieldEnum: {
    id: 'id',
    dashboardId: 'dashboardId',
    categoria: 'categoria',
    receita: 'receita'
  };

  export type ReceitaCategoriaScalarFieldEnum = (typeof ReceitaCategoriaScalarFieldEnum)[keyof typeof ReceitaCategoriaScalarFieldEnum]


  export const ReceitaMetodoPagamentoScalarFieldEnum: {
    id: 'id',
    dashboardId: 'dashboardId',
    metodoPagamento: 'metodoPagamento',
    receita: 'receita'
  };

  export type ReceitaMetodoPagamentoScalarFieldEnum = (typeof ReceitaMetodoPagamentoScalarFieldEnum)[keyof typeof ReceitaMetodoPagamentoScalarFieldEnum]


  export const ClientesRecorrentesVsUnicosScalarFieldEnum: {
    id: 'id',
    dashboardId: 'dashboardId',
    tipoCliente: 'tipoCliente',
    quantidade: 'quantidade'
  };

  export type ClientesRecorrentesVsUnicosScalarFieldEnum = (typeof ClientesRecorrentesVsUnicosScalarFieldEnum)[keyof typeof ClientesRecorrentesVsUnicosScalarFieldEnum]


  export const ProdutoRankScalarFieldEnum: {
    id: 'id',
    dashboardId: 'dashboardId',
    produto: 'produto',
    vendas: 'vendas'
  };

  export type ProdutoRankScalarFieldEnum = (typeof ProdutoRankScalarFieldEnum)[keyof typeof ProdutoRankScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type OrganizationWhereInput = {
    AND?: OrganizationWhereInput | OrganizationWhereInput[]
    OR?: OrganizationWhereInput[]
    NOT?: OrganizationWhereInput | OrganizationWhereInput[]
    id?: StringFilter<"Organization"> | string
    name?: StringFilter<"Organization"> | string
    googleAccessToken?: StringNullableFilter<"Organization"> | string | null
    googleRefreshToken?: StringNullableFilter<"Organization"> | string | null
    googleScopes?: StringNullableFilter<"Organization"> | string | null
    createdAt?: DateTimeFilter<"Organization"> | Date | string
    updatedAt?: DateTimeFilter<"Organization"> | Date | string
    googleExpiresIn?: FloatNullableFilter<"Organization"> | number | null
    dashboardComercial?: XOR<DashboardComercialNullableScalarRelationFilter, DashboardComercialWhereInput> | null
    dashboardMarketing?: XOR<DashboardMarketingNullableScalarRelationFilter, DashboardMarketingWhereInput> | null
    users?: UserListRelationFilter
  }

  export type OrganizationOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    googleAccessToken?: SortOrderInput | SortOrder
    googleRefreshToken?: SortOrderInput | SortOrder
    googleScopes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    googleExpiresIn?: SortOrderInput | SortOrder
    dashboardComercial?: DashboardComercialOrderByWithRelationInput
    dashboardMarketing?: DashboardMarketingOrderByWithRelationInput
    users?: UserOrderByRelationAggregateInput
  }

  export type OrganizationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: OrganizationWhereInput | OrganizationWhereInput[]
    OR?: OrganizationWhereInput[]
    NOT?: OrganizationWhereInput | OrganizationWhereInput[]
    name?: StringFilter<"Organization"> | string
    googleAccessToken?: StringNullableFilter<"Organization"> | string | null
    googleRefreshToken?: StringNullableFilter<"Organization"> | string | null
    googleScopes?: StringNullableFilter<"Organization"> | string | null
    createdAt?: DateTimeFilter<"Organization"> | Date | string
    updatedAt?: DateTimeFilter<"Organization"> | Date | string
    googleExpiresIn?: FloatNullableFilter<"Organization"> | number | null
    dashboardComercial?: XOR<DashboardComercialNullableScalarRelationFilter, DashboardComercialWhereInput> | null
    dashboardMarketing?: XOR<DashboardMarketingNullableScalarRelationFilter, DashboardMarketingWhereInput> | null
    users?: UserListRelationFilter
  }, "id">

  export type OrganizationOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    googleAccessToken?: SortOrderInput | SortOrder
    googleRefreshToken?: SortOrderInput | SortOrder
    googleScopes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    googleExpiresIn?: SortOrderInput | SortOrder
    _count?: OrganizationCountOrderByAggregateInput
    _avg?: OrganizationAvgOrderByAggregateInput
    _max?: OrganizationMaxOrderByAggregateInput
    _min?: OrganizationMinOrderByAggregateInput
    _sum?: OrganizationSumOrderByAggregateInput
  }

  export type OrganizationScalarWhereWithAggregatesInput = {
    AND?: OrganizationScalarWhereWithAggregatesInput | OrganizationScalarWhereWithAggregatesInput[]
    OR?: OrganizationScalarWhereWithAggregatesInput[]
    NOT?: OrganizationScalarWhereWithAggregatesInput | OrganizationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Organization"> | string
    name?: StringWithAggregatesFilter<"Organization"> | string
    googleAccessToken?: StringNullableWithAggregatesFilter<"Organization"> | string | null
    googleRefreshToken?: StringNullableWithAggregatesFilter<"Organization"> | string | null
    googleScopes?: StringNullableWithAggregatesFilter<"Organization"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Organization"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Organization"> | Date | string
    googleExpiresIn?: FloatNullableWithAggregatesFilter<"Organization"> | number | null
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    organizationId?: StringFilter<"User"> | string
    organization?: XOR<OrganizationScalarRelationFilter, OrganizationWhereInput>
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    organizationId?: SortOrder
    organization?: OrganizationOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    organizationId?: StringFilter<"User"> | string
    organization?: XOR<OrganizationScalarRelationFilter, OrganizationWhereInput>
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    organizationId?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    organizationId?: StringWithAggregatesFilter<"User"> | string
  }

  export type PedidoWhereInput = {
    AND?: PedidoWhereInput | PedidoWhereInput[]
    OR?: PedidoWhereInput[]
    NOT?: PedidoWhereInput | PedidoWhereInput[]
    id?: StringFilter<"Pedido"> | string
    dataPedido?: DateTimeFilter<"Pedido"> | Date | string
    dataAprovacao?: DateTimeFilter<"Pedido"> | Date | string
    cancelada?: BoolFilter<"Pedido"> | boolean
    faturado?: BoolFilter<"Pedido"> | boolean
    codigoPedido?: StringFilter<"Pedido"> | string
    codigoProduto?: StringFilter<"Pedido"> | string
    setor?: StringFilter<"Pedido"> | string
    produto?: StringFilter<"Pedido"> | string
    precoUnitario?: DecimalFilter<"Pedido"> | Decimal | DecimalJsLike | number | string
    quantidade?: DecimalFilter<"Pedido"> | Decimal | DecimalJsLike | number | string
    valorTotal?: DecimalFilter<"Pedido"> | Decimal | DecimalJsLike | number | string
    cliente?: StringFilter<"Pedido"> | string
    vendedor?: StringFilter<"Pedido"> | string
  }

  export type PedidoOrderByWithRelationInput = {
    id?: SortOrder
    dataPedido?: SortOrder
    dataAprovacao?: SortOrder
    cancelada?: SortOrder
    faturado?: SortOrder
    codigoPedido?: SortOrder
    codigoProduto?: SortOrder
    setor?: SortOrder
    produto?: SortOrder
    precoUnitario?: SortOrder
    quantidade?: SortOrder
    valorTotal?: SortOrder
    cliente?: SortOrder
    vendedor?: SortOrder
  }

  export type PedidoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PedidoWhereInput | PedidoWhereInput[]
    OR?: PedidoWhereInput[]
    NOT?: PedidoWhereInput | PedidoWhereInput[]
    dataPedido?: DateTimeFilter<"Pedido"> | Date | string
    dataAprovacao?: DateTimeFilter<"Pedido"> | Date | string
    cancelada?: BoolFilter<"Pedido"> | boolean
    faturado?: BoolFilter<"Pedido"> | boolean
    codigoPedido?: StringFilter<"Pedido"> | string
    codigoProduto?: StringFilter<"Pedido"> | string
    setor?: StringFilter<"Pedido"> | string
    produto?: StringFilter<"Pedido"> | string
    precoUnitario?: DecimalFilter<"Pedido"> | Decimal | DecimalJsLike | number | string
    quantidade?: DecimalFilter<"Pedido"> | Decimal | DecimalJsLike | number | string
    valorTotal?: DecimalFilter<"Pedido"> | Decimal | DecimalJsLike | number | string
    cliente?: StringFilter<"Pedido"> | string
    vendedor?: StringFilter<"Pedido"> | string
  }, "id">

  export type PedidoOrderByWithAggregationInput = {
    id?: SortOrder
    dataPedido?: SortOrder
    dataAprovacao?: SortOrder
    cancelada?: SortOrder
    faturado?: SortOrder
    codigoPedido?: SortOrder
    codigoProduto?: SortOrder
    setor?: SortOrder
    produto?: SortOrder
    precoUnitario?: SortOrder
    quantidade?: SortOrder
    valorTotal?: SortOrder
    cliente?: SortOrder
    vendedor?: SortOrder
    _count?: PedidoCountOrderByAggregateInput
    _avg?: PedidoAvgOrderByAggregateInput
    _max?: PedidoMaxOrderByAggregateInput
    _min?: PedidoMinOrderByAggregateInput
    _sum?: PedidoSumOrderByAggregateInput
  }

  export type PedidoScalarWhereWithAggregatesInput = {
    AND?: PedidoScalarWhereWithAggregatesInput | PedidoScalarWhereWithAggregatesInput[]
    OR?: PedidoScalarWhereWithAggregatesInput[]
    NOT?: PedidoScalarWhereWithAggregatesInput | PedidoScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Pedido"> | string
    dataPedido?: DateTimeWithAggregatesFilter<"Pedido"> | Date | string
    dataAprovacao?: DateTimeWithAggregatesFilter<"Pedido"> | Date | string
    cancelada?: BoolWithAggregatesFilter<"Pedido"> | boolean
    faturado?: BoolWithAggregatesFilter<"Pedido"> | boolean
    codigoPedido?: StringWithAggregatesFilter<"Pedido"> | string
    codigoProduto?: StringWithAggregatesFilter<"Pedido"> | string
    setor?: StringWithAggregatesFilter<"Pedido"> | string
    produto?: StringWithAggregatesFilter<"Pedido"> | string
    precoUnitario?: DecimalWithAggregatesFilter<"Pedido"> | Decimal | DecimalJsLike | number | string
    quantidade?: DecimalWithAggregatesFilter<"Pedido"> | Decimal | DecimalJsLike | number | string
    valorTotal?: DecimalWithAggregatesFilter<"Pedido"> | Decimal | DecimalJsLike | number | string
    cliente?: StringWithAggregatesFilter<"Pedido"> | string
    vendedor?: StringWithAggregatesFilter<"Pedido"> | string
  }

  export type DashboardMarketingWhereInput = {
    AND?: DashboardMarketingWhereInput | DashboardMarketingWhereInput[]
    OR?: DashboardMarketingWhereInput[]
    NOT?: DashboardMarketingWhereInput | DashboardMarketingWhereInput[]
    id?: StringFilter<"DashboardMarketing"> | string
    organizationId?: StringFilter<"DashboardMarketing"> | string
    sessoes?: IntFilter<"DashboardMarketing"> | number
    usuarios?: IntFilter<"DashboardMarketing"> | number
    taxaRejeicao?: FloatFilter<"DashboardMarketing"> | number
    taxaConversaoSite?: FloatFilter<"DashboardMarketing"> | number
    taxaAbandonoCarrinho?: FloatFilter<"DashboardMarketing"> | number
    impressoes?: IntFilter<"DashboardMarketing"> | number
    cliques?: IntFilter<"DashboardMarketing"> | number
    ctr?: FloatFilter<"DashboardMarketing"> | number
    cpc?: DecimalFilter<"DashboardMarketing"> | Decimal | DecimalJsLike | number | string
    conversoes?: IntFilter<"DashboardMarketing"> | number
    custoPorConversao?: DecimalFilter<"DashboardMarketing"> | Decimal | DecimalJsLike | number | string
    roas?: FloatFilter<"DashboardMarketing"> | number
    custoPorLead?: DecimalFilter<"DashboardMarketing"> | Decimal | DecimalJsLike | number | string
    faturamentoTotal?: DecimalFilter<"DashboardMarketing"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"DashboardMarketing"> | Date | string
    updatedAt?: DateTimeFilter<"DashboardMarketing"> | Date | string
    anunciosCTR?: AnuncioCTRListRelationFilter
    anunciosConv?: AnuncioConversaoListRelationFilter
    canais?: CanalTrafegoListRelationFilter
    organization?: XOR<OrganizationScalarRelationFilter, OrganizationWhereInput>
    palavrasChave?: PalavraChaveListRelationFilter
    trafego?: TrafegoListRelationFilter
  }

  export type DashboardMarketingOrderByWithRelationInput = {
    id?: SortOrder
    organizationId?: SortOrder
    sessoes?: SortOrder
    usuarios?: SortOrder
    taxaRejeicao?: SortOrder
    taxaConversaoSite?: SortOrder
    taxaAbandonoCarrinho?: SortOrder
    impressoes?: SortOrder
    cliques?: SortOrder
    ctr?: SortOrder
    cpc?: SortOrder
    conversoes?: SortOrder
    custoPorConversao?: SortOrder
    roas?: SortOrder
    custoPorLead?: SortOrder
    faturamentoTotal?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    anunciosCTR?: AnuncioCTROrderByRelationAggregateInput
    anunciosConv?: AnuncioConversaoOrderByRelationAggregateInput
    canais?: CanalTrafegoOrderByRelationAggregateInput
    organization?: OrganizationOrderByWithRelationInput
    palavrasChave?: PalavraChaveOrderByRelationAggregateInput
    trafego?: TrafegoOrderByRelationAggregateInput
  }

  export type DashboardMarketingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    organizationId?: string
    AND?: DashboardMarketingWhereInput | DashboardMarketingWhereInput[]
    OR?: DashboardMarketingWhereInput[]
    NOT?: DashboardMarketingWhereInput | DashboardMarketingWhereInput[]
    sessoes?: IntFilter<"DashboardMarketing"> | number
    usuarios?: IntFilter<"DashboardMarketing"> | number
    taxaRejeicao?: FloatFilter<"DashboardMarketing"> | number
    taxaConversaoSite?: FloatFilter<"DashboardMarketing"> | number
    taxaAbandonoCarrinho?: FloatFilter<"DashboardMarketing"> | number
    impressoes?: IntFilter<"DashboardMarketing"> | number
    cliques?: IntFilter<"DashboardMarketing"> | number
    ctr?: FloatFilter<"DashboardMarketing"> | number
    cpc?: DecimalFilter<"DashboardMarketing"> | Decimal | DecimalJsLike | number | string
    conversoes?: IntFilter<"DashboardMarketing"> | number
    custoPorConversao?: DecimalFilter<"DashboardMarketing"> | Decimal | DecimalJsLike | number | string
    roas?: FloatFilter<"DashboardMarketing"> | number
    custoPorLead?: DecimalFilter<"DashboardMarketing"> | Decimal | DecimalJsLike | number | string
    faturamentoTotal?: DecimalFilter<"DashboardMarketing"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"DashboardMarketing"> | Date | string
    updatedAt?: DateTimeFilter<"DashboardMarketing"> | Date | string
    anunciosCTR?: AnuncioCTRListRelationFilter
    anunciosConv?: AnuncioConversaoListRelationFilter
    canais?: CanalTrafegoListRelationFilter
    organization?: XOR<OrganizationScalarRelationFilter, OrganizationWhereInput>
    palavrasChave?: PalavraChaveListRelationFilter
    trafego?: TrafegoListRelationFilter
  }, "id" | "organizationId">

  export type DashboardMarketingOrderByWithAggregationInput = {
    id?: SortOrder
    organizationId?: SortOrder
    sessoes?: SortOrder
    usuarios?: SortOrder
    taxaRejeicao?: SortOrder
    taxaConversaoSite?: SortOrder
    taxaAbandonoCarrinho?: SortOrder
    impressoes?: SortOrder
    cliques?: SortOrder
    ctr?: SortOrder
    cpc?: SortOrder
    conversoes?: SortOrder
    custoPorConversao?: SortOrder
    roas?: SortOrder
    custoPorLead?: SortOrder
    faturamentoTotal?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DashboardMarketingCountOrderByAggregateInput
    _avg?: DashboardMarketingAvgOrderByAggregateInput
    _max?: DashboardMarketingMaxOrderByAggregateInput
    _min?: DashboardMarketingMinOrderByAggregateInput
    _sum?: DashboardMarketingSumOrderByAggregateInput
  }

  export type DashboardMarketingScalarWhereWithAggregatesInput = {
    AND?: DashboardMarketingScalarWhereWithAggregatesInput | DashboardMarketingScalarWhereWithAggregatesInput[]
    OR?: DashboardMarketingScalarWhereWithAggregatesInput[]
    NOT?: DashboardMarketingScalarWhereWithAggregatesInput | DashboardMarketingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DashboardMarketing"> | string
    organizationId?: StringWithAggregatesFilter<"DashboardMarketing"> | string
    sessoes?: IntWithAggregatesFilter<"DashboardMarketing"> | number
    usuarios?: IntWithAggregatesFilter<"DashboardMarketing"> | number
    taxaRejeicao?: FloatWithAggregatesFilter<"DashboardMarketing"> | number
    taxaConversaoSite?: FloatWithAggregatesFilter<"DashboardMarketing"> | number
    taxaAbandonoCarrinho?: FloatWithAggregatesFilter<"DashboardMarketing"> | number
    impressoes?: IntWithAggregatesFilter<"DashboardMarketing"> | number
    cliques?: IntWithAggregatesFilter<"DashboardMarketing"> | number
    ctr?: FloatWithAggregatesFilter<"DashboardMarketing"> | number
    cpc?: DecimalWithAggregatesFilter<"DashboardMarketing"> | Decimal | DecimalJsLike | number | string
    conversoes?: IntWithAggregatesFilter<"DashboardMarketing"> | number
    custoPorConversao?: DecimalWithAggregatesFilter<"DashboardMarketing"> | Decimal | DecimalJsLike | number | string
    roas?: FloatWithAggregatesFilter<"DashboardMarketing"> | number
    custoPorLead?: DecimalWithAggregatesFilter<"DashboardMarketing"> | Decimal | DecimalJsLike | number | string
    faturamentoTotal?: DecimalWithAggregatesFilter<"DashboardMarketing"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeWithAggregatesFilter<"DashboardMarketing"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DashboardMarketing"> | Date | string
  }

  export type TrafegoWhereInput = {
    AND?: TrafegoWhereInput | TrafegoWhereInput[]
    OR?: TrafegoWhereInput[]
    NOT?: TrafegoWhereInput | TrafegoWhereInput[]
    id?: StringFilter<"Trafego"> | string
    dashboardId?: StringFilter<"Trafego"> | string
    origem?: StringFilter<"Trafego"> | string
    valor?: IntFilter<"Trafego"> | number
    dashboard?: XOR<DashboardMarketingScalarRelationFilter, DashboardMarketingWhereInput>
  }

  export type TrafegoOrderByWithRelationInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    origem?: SortOrder
    valor?: SortOrder
    dashboard?: DashboardMarketingOrderByWithRelationInput
  }

  export type TrafegoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TrafegoWhereInput | TrafegoWhereInput[]
    OR?: TrafegoWhereInput[]
    NOT?: TrafegoWhereInput | TrafegoWhereInput[]
    dashboardId?: StringFilter<"Trafego"> | string
    origem?: StringFilter<"Trafego"> | string
    valor?: IntFilter<"Trafego"> | number
    dashboard?: XOR<DashboardMarketingScalarRelationFilter, DashboardMarketingWhereInput>
  }, "id">

  export type TrafegoOrderByWithAggregationInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    origem?: SortOrder
    valor?: SortOrder
    _count?: TrafegoCountOrderByAggregateInput
    _avg?: TrafegoAvgOrderByAggregateInput
    _max?: TrafegoMaxOrderByAggregateInput
    _min?: TrafegoMinOrderByAggregateInput
    _sum?: TrafegoSumOrderByAggregateInput
  }

  export type TrafegoScalarWhereWithAggregatesInput = {
    AND?: TrafegoScalarWhereWithAggregatesInput | TrafegoScalarWhereWithAggregatesInput[]
    OR?: TrafegoScalarWhereWithAggregatesInput[]
    NOT?: TrafegoScalarWhereWithAggregatesInput | TrafegoScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Trafego"> | string
    dashboardId?: StringWithAggregatesFilter<"Trafego"> | string
    origem?: StringWithAggregatesFilter<"Trafego"> | string
    valor?: IntWithAggregatesFilter<"Trafego"> | number
  }

  export type CanalTrafegoWhereInput = {
    AND?: CanalTrafegoWhereInput | CanalTrafegoWhereInput[]
    OR?: CanalTrafegoWhereInput[]
    NOT?: CanalTrafegoWhereInput | CanalTrafegoWhereInput[]
    id?: StringFilter<"CanalTrafego"> | string
    dashboardId?: StringFilter<"CanalTrafego"> | string
    canal?: StringFilter<"CanalTrafego"> | string
    taxaConversao?: FloatFilter<"CanalTrafego"> | number
    cpa?: DecimalFilter<"CanalTrafego"> | Decimal | DecimalJsLike | number | string
    roi?: FloatFilter<"CanalTrafego"> | number
    dashboard?: XOR<DashboardMarketingScalarRelationFilter, DashboardMarketingWhereInput>
  }

  export type CanalTrafegoOrderByWithRelationInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    canal?: SortOrder
    taxaConversao?: SortOrder
    cpa?: SortOrder
    roi?: SortOrder
    dashboard?: DashboardMarketingOrderByWithRelationInput
  }

  export type CanalTrafegoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CanalTrafegoWhereInput | CanalTrafegoWhereInput[]
    OR?: CanalTrafegoWhereInput[]
    NOT?: CanalTrafegoWhereInput | CanalTrafegoWhereInput[]
    dashboardId?: StringFilter<"CanalTrafego"> | string
    canal?: StringFilter<"CanalTrafego"> | string
    taxaConversao?: FloatFilter<"CanalTrafego"> | number
    cpa?: DecimalFilter<"CanalTrafego"> | Decimal | DecimalJsLike | number | string
    roi?: FloatFilter<"CanalTrafego"> | number
    dashboard?: XOR<DashboardMarketingScalarRelationFilter, DashboardMarketingWhereInput>
  }, "id">

  export type CanalTrafegoOrderByWithAggregationInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    canal?: SortOrder
    taxaConversao?: SortOrder
    cpa?: SortOrder
    roi?: SortOrder
    _count?: CanalTrafegoCountOrderByAggregateInput
    _avg?: CanalTrafegoAvgOrderByAggregateInput
    _max?: CanalTrafegoMaxOrderByAggregateInput
    _min?: CanalTrafegoMinOrderByAggregateInput
    _sum?: CanalTrafegoSumOrderByAggregateInput
  }

  export type CanalTrafegoScalarWhereWithAggregatesInput = {
    AND?: CanalTrafegoScalarWhereWithAggregatesInput | CanalTrafegoScalarWhereWithAggregatesInput[]
    OR?: CanalTrafegoScalarWhereWithAggregatesInput[]
    NOT?: CanalTrafegoScalarWhereWithAggregatesInput | CanalTrafegoScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CanalTrafego"> | string
    dashboardId?: StringWithAggregatesFilter<"CanalTrafego"> | string
    canal?: StringWithAggregatesFilter<"CanalTrafego"> | string
    taxaConversao?: FloatWithAggregatesFilter<"CanalTrafego"> | number
    cpa?: DecimalWithAggregatesFilter<"CanalTrafego"> | Decimal | DecimalJsLike | number | string
    roi?: FloatWithAggregatesFilter<"CanalTrafego"> | number
  }

  export type AnuncioCTRWhereInput = {
    AND?: AnuncioCTRWhereInput | AnuncioCTRWhereInput[]
    OR?: AnuncioCTRWhereInput[]
    NOT?: AnuncioCTRWhereInput | AnuncioCTRWhereInput[]
    id?: StringFilter<"AnuncioCTR"> | string
    dashboardId?: StringFilter<"AnuncioCTR"> | string
    nome?: StringFilter<"AnuncioCTR"> | string
    ctr?: FloatFilter<"AnuncioCTR"> | number
    dashboard?: XOR<DashboardMarketingScalarRelationFilter, DashboardMarketingWhereInput>
  }

  export type AnuncioCTROrderByWithRelationInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    nome?: SortOrder
    ctr?: SortOrder
    dashboard?: DashboardMarketingOrderByWithRelationInput
  }

  export type AnuncioCTRWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AnuncioCTRWhereInput | AnuncioCTRWhereInput[]
    OR?: AnuncioCTRWhereInput[]
    NOT?: AnuncioCTRWhereInput | AnuncioCTRWhereInput[]
    dashboardId?: StringFilter<"AnuncioCTR"> | string
    nome?: StringFilter<"AnuncioCTR"> | string
    ctr?: FloatFilter<"AnuncioCTR"> | number
    dashboard?: XOR<DashboardMarketingScalarRelationFilter, DashboardMarketingWhereInput>
  }, "id">

  export type AnuncioCTROrderByWithAggregationInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    nome?: SortOrder
    ctr?: SortOrder
    _count?: AnuncioCTRCountOrderByAggregateInput
    _avg?: AnuncioCTRAvgOrderByAggregateInput
    _max?: AnuncioCTRMaxOrderByAggregateInput
    _min?: AnuncioCTRMinOrderByAggregateInput
    _sum?: AnuncioCTRSumOrderByAggregateInput
  }

  export type AnuncioCTRScalarWhereWithAggregatesInput = {
    AND?: AnuncioCTRScalarWhereWithAggregatesInput | AnuncioCTRScalarWhereWithAggregatesInput[]
    OR?: AnuncioCTRScalarWhereWithAggregatesInput[]
    NOT?: AnuncioCTRScalarWhereWithAggregatesInput | AnuncioCTRScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AnuncioCTR"> | string
    dashboardId?: StringWithAggregatesFilter<"AnuncioCTR"> | string
    nome?: StringWithAggregatesFilter<"AnuncioCTR"> | string
    ctr?: FloatWithAggregatesFilter<"AnuncioCTR"> | number
  }

  export type AnuncioConversaoWhereInput = {
    AND?: AnuncioConversaoWhereInput | AnuncioConversaoWhereInput[]
    OR?: AnuncioConversaoWhereInput[]
    NOT?: AnuncioConversaoWhereInput | AnuncioConversaoWhereInput[]
    id?: StringFilter<"AnuncioConversao"> | string
    dashboardId?: StringFilter<"AnuncioConversao"> | string
    nome?: StringFilter<"AnuncioConversao"> | string
    conversoes?: IntFilter<"AnuncioConversao"> | number
    dashboard?: XOR<DashboardMarketingScalarRelationFilter, DashboardMarketingWhereInput>
  }

  export type AnuncioConversaoOrderByWithRelationInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    nome?: SortOrder
    conversoes?: SortOrder
    dashboard?: DashboardMarketingOrderByWithRelationInput
  }

  export type AnuncioConversaoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AnuncioConversaoWhereInput | AnuncioConversaoWhereInput[]
    OR?: AnuncioConversaoWhereInput[]
    NOT?: AnuncioConversaoWhereInput | AnuncioConversaoWhereInput[]
    dashboardId?: StringFilter<"AnuncioConversao"> | string
    nome?: StringFilter<"AnuncioConversao"> | string
    conversoes?: IntFilter<"AnuncioConversao"> | number
    dashboard?: XOR<DashboardMarketingScalarRelationFilter, DashboardMarketingWhereInput>
  }, "id">

  export type AnuncioConversaoOrderByWithAggregationInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    nome?: SortOrder
    conversoes?: SortOrder
    _count?: AnuncioConversaoCountOrderByAggregateInput
    _avg?: AnuncioConversaoAvgOrderByAggregateInput
    _max?: AnuncioConversaoMaxOrderByAggregateInput
    _min?: AnuncioConversaoMinOrderByAggregateInput
    _sum?: AnuncioConversaoSumOrderByAggregateInput
  }

  export type AnuncioConversaoScalarWhereWithAggregatesInput = {
    AND?: AnuncioConversaoScalarWhereWithAggregatesInput | AnuncioConversaoScalarWhereWithAggregatesInput[]
    OR?: AnuncioConversaoScalarWhereWithAggregatesInput[]
    NOT?: AnuncioConversaoScalarWhereWithAggregatesInput | AnuncioConversaoScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AnuncioConversao"> | string
    dashboardId?: StringWithAggregatesFilter<"AnuncioConversao"> | string
    nome?: StringWithAggregatesFilter<"AnuncioConversao"> | string
    conversoes?: IntWithAggregatesFilter<"AnuncioConversao"> | number
  }

  export type PalavraChaveWhereInput = {
    AND?: PalavraChaveWhereInput | PalavraChaveWhereInput[]
    OR?: PalavraChaveWhereInput[]
    NOT?: PalavraChaveWhereInput | PalavraChaveWhereInput[]
    id?: StringFilter<"PalavraChave"> | string
    dashboardId?: StringFilter<"PalavraChave"> | string
    palavra?: StringFilter<"PalavraChave"> | string
    ctr?: FloatFilter<"PalavraChave"> | number
    dashboard?: XOR<DashboardMarketingScalarRelationFilter, DashboardMarketingWhereInput>
  }

  export type PalavraChaveOrderByWithRelationInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    palavra?: SortOrder
    ctr?: SortOrder
    dashboard?: DashboardMarketingOrderByWithRelationInput
  }

  export type PalavraChaveWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PalavraChaveWhereInput | PalavraChaveWhereInput[]
    OR?: PalavraChaveWhereInput[]
    NOT?: PalavraChaveWhereInput | PalavraChaveWhereInput[]
    dashboardId?: StringFilter<"PalavraChave"> | string
    palavra?: StringFilter<"PalavraChave"> | string
    ctr?: FloatFilter<"PalavraChave"> | number
    dashboard?: XOR<DashboardMarketingScalarRelationFilter, DashboardMarketingWhereInput>
  }, "id">

  export type PalavraChaveOrderByWithAggregationInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    palavra?: SortOrder
    ctr?: SortOrder
    _count?: PalavraChaveCountOrderByAggregateInput
    _avg?: PalavraChaveAvgOrderByAggregateInput
    _max?: PalavraChaveMaxOrderByAggregateInput
    _min?: PalavraChaveMinOrderByAggregateInput
    _sum?: PalavraChaveSumOrderByAggregateInput
  }

  export type PalavraChaveScalarWhereWithAggregatesInput = {
    AND?: PalavraChaveScalarWhereWithAggregatesInput | PalavraChaveScalarWhereWithAggregatesInput[]
    OR?: PalavraChaveScalarWhereWithAggregatesInput[]
    NOT?: PalavraChaveScalarWhereWithAggregatesInput | PalavraChaveScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PalavraChave"> | string
    dashboardId?: StringWithAggregatesFilter<"PalavraChave"> | string
    palavra?: StringWithAggregatesFilter<"PalavraChave"> | string
    ctr?: FloatWithAggregatesFilter<"PalavraChave"> | number
  }

  export type DashboardComercialWhereInput = {
    AND?: DashboardComercialWhereInput | DashboardComercialWhereInput[]
    OR?: DashboardComercialWhereInput[]
    NOT?: DashboardComercialWhereInput | DashboardComercialWhereInput[]
    id?: StringFilter<"DashboardComercial"> | string
    organizationId?: StringFilter<"DashboardComercial"> | string
    receitaTotal?: DecimalFilter<"DashboardComercial"> | Decimal | DecimalJsLike | number | string
    ticketMedio?: DecimalFilter<"DashboardComercial"> | Decimal | DecimalJsLike | number | string
    crescimentoReceita?: FloatFilter<"DashboardComercial"> | number
    novosClientes?: IntFilter<"DashboardComercial"> | number
    taxaRetencaoClientes?: FloatFilter<"DashboardComercial"> | number
    clv?: DecimalFilter<"DashboardComercial"> | Decimal | DecimalJsLike | number | string
    volumeReparos?: IntFilter<"DashboardComercial"> | number
    taxaReincidenciaReparos?: FloatFilter<"DashboardComercial"> | number
    receitaReparosVsVendas?: FloatFilter<"DashboardComercial"> | number
    createdAt?: DateTimeFilter<"DashboardComercial"> | Date | string
    updatedAt?: DateTimeFilter<"DashboardComercial"> | Date | string
    clientesComparacao?: ClientesRecorrentesVsUnicosListRelationFilter
    organization?: XOR<OrganizationScalarRelationFilter, OrganizationWhereInput>
    produtosTop?: ProdutoRankListRelationFilter
    receitaPorCategoria?: ReceitaCategoriaListRelationFilter
    receitaPorPagamento?: ReceitaMetodoPagamentoListRelationFilter
  }

  export type DashboardComercialOrderByWithRelationInput = {
    id?: SortOrder
    organizationId?: SortOrder
    receitaTotal?: SortOrder
    ticketMedio?: SortOrder
    crescimentoReceita?: SortOrder
    novosClientes?: SortOrder
    taxaRetencaoClientes?: SortOrder
    clv?: SortOrder
    volumeReparos?: SortOrder
    taxaReincidenciaReparos?: SortOrder
    receitaReparosVsVendas?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    clientesComparacao?: ClientesRecorrentesVsUnicosOrderByRelationAggregateInput
    organization?: OrganizationOrderByWithRelationInput
    produtosTop?: ProdutoRankOrderByRelationAggregateInput
    receitaPorCategoria?: ReceitaCategoriaOrderByRelationAggregateInput
    receitaPorPagamento?: ReceitaMetodoPagamentoOrderByRelationAggregateInput
  }

  export type DashboardComercialWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    organizationId?: string
    AND?: DashboardComercialWhereInput | DashboardComercialWhereInput[]
    OR?: DashboardComercialWhereInput[]
    NOT?: DashboardComercialWhereInput | DashboardComercialWhereInput[]
    receitaTotal?: DecimalFilter<"DashboardComercial"> | Decimal | DecimalJsLike | number | string
    ticketMedio?: DecimalFilter<"DashboardComercial"> | Decimal | DecimalJsLike | number | string
    crescimentoReceita?: FloatFilter<"DashboardComercial"> | number
    novosClientes?: IntFilter<"DashboardComercial"> | number
    taxaRetencaoClientes?: FloatFilter<"DashboardComercial"> | number
    clv?: DecimalFilter<"DashboardComercial"> | Decimal | DecimalJsLike | number | string
    volumeReparos?: IntFilter<"DashboardComercial"> | number
    taxaReincidenciaReparos?: FloatFilter<"DashboardComercial"> | number
    receitaReparosVsVendas?: FloatFilter<"DashboardComercial"> | number
    createdAt?: DateTimeFilter<"DashboardComercial"> | Date | string
    updatedAt?: DateTimeFilter<"DashboardComercial"> | Date | string
    clientesComparacao?: ClientesRecorrentesVsUnicosListRelationFilter
    organization?: XOR<OrganizationScalarRelationFilter, OrganizationWhereInput>
    produtosTop?: ProdutoRankListRelationFilter
    receitaPorCategoria?: ReceitaCategoriaListRelationFilter
    receitaPorPagamento?: ReceitaMetodoPagamentoListRelationFilter
  }, "id" | "organizationId">

  export type DashboardComercialOrderByWithAggregationInput = {
    id?: SortOrder
    organizationId?: SortOrder
    receitaTotal?: SortOrder
    ticketMedio?: SortOrder
    crescimentoReceita?: SortOrder
    novosClientes?: SortOrder
    taxaRetencaoClientes?: SortOrder
    clv?: SortOrder
    volumeReparos?: SortOrder
    taxaReincidenciaReparos?: SortOrder
    receitaReparosVsVendas?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DashboardComercialCountOrderByAggregateInput
    _avg?: DashboardComercialAvgOrderByAggregateInput
    _max?: DashboardComercialMaxOrderByAggregateInput
    _min?: DashboardComercialMinOrderByAggregateInput
    _sum?: DashboardComercialSumOrderByAggregateInput
  }

  export type DashboardComercialScalarWhereWithAggregatesInput = {
    AND?: DashboardComercialScalarWhereWithAggregatesInput | DashboardComercialScalarWhereWithAggregatesInput[]
    OR?: DashboardComercialScalarWhereWithAggregatesInput[]
    NOT?: DashboardComercialScalarWhereWithAggregatesInput | DashboardComercialScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DashboardComercial"> | string
    organizationId?: StringWithAggregatesFilter<"DashboardComercial"> | string
    receitaTotal?: DecimalWithAggregatesFilter<"DashboardComercial"> | Decimal | DecimalJsLike | number | string
    ticketMedio?: DecimalWithAggregatesFilter<"DashboardComercial"> | Decimal | DecimalJsLike | number | string
    crescimentoReceita?: FloatWithAggregatesFilter<"DashboardComercial"> | number
    novosClientes?: IntWithAggregatesFilter<"DashboardComercial"> | number
    taxaRetencaoClientes?: FloatWithAggregatesFilter<"DashboardComercial"> | number
    clv?: DecimalWithAggregatesFilter<"DashboardComercial"> | Decimal | DecimalJsLike | number | string
    volumeReparos?: IntWithAggregatesFilter<"DashboardComercial"> | number
    taxaReincidenciaReparos?: FloatWithAggregatesFilter<"DashboardComercial"> | number
    receitaReparosVsVendas?: FloatWithAggregatesFilter<"DashboardComercial"> | number
    createdAt?: DateTimeWithAggregatesFilter<"DashboardComercial"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DashboardComercial"> | Date | string
  }

  export type ReceitaCategoriaWhereInput = {
    AND?: ReceitaCategoriaWhereInput | ReceitaCategoriaWhereInput[]
    OR?: ReceitaCategoriaWhereInput[]
    NOT?: ReceitaCategoriaWhereInput | ReceitaCategoriaWhereInput[]
    id?: StringFilter<"ReceitaCategoria"> | string
    dashboardId?: StringFilter<"ReceitaCategoria"> | string
    categoria?: StringFilter<"ReceitaCategoria"> | string
    receita?: DecimalFilter<"ReceitaCategoria"> | Decimal | DecimalJsLike | number | string
    dashboard?: XOR<DashboardComercialScalarRelationFilter, DashboardComercialWhereInput>
  }

  export type ReceitaCategoriaOrderByWithRelationInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    categoria?: SortOrder
    receita?: SortOrder
    dashboard?: DashboardComercialOrderByWithRelationInput
  }

  export type ReceitaCategoriaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ReceitaCategoriaWhereInput | ReceitaCategoriaWhereInput[]
    OR?: ReceitaCategoriaWhereInput[]
    NOT?: ReceitaCategoriaWhereInput | ReceitaCategoriaWhereInput[]
    dashboardId?: StringFilter<"ReceitaCategoria"> | string
    categoria?: StringFilter<"ReceitaCategoria"> | string
    receita?: DecimalFilter<"ReceitaCategoria"> | Decimal | DecimalJsLike | number | string
    dashboard?: XOR<DashboardComercialScalarRelationFilter, DashboardComercialWhereInput>
  }, "id">

  export type ReceitaCategoriaOrderByWithAggregationInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    categoria?: SortOrder
    receita?: SortOrder
    _count?: ReceitaCategoriaCountOrderByAggregateInput
    _avg?: ReceitaCategoriaAvgOrderByAggregateInput
    _max?: ReceitaCategoriaMaxOrderByAggregateInput
    _min?: ReceitaCategoriaMinOrderByAggregateInput
    _sum?: ReceitaCategoriaSumOrderByAggregateInput
  }

  export type ReceitaCategoriaScalarWhereWithAggregatesInput = {
    AND?: ReceitaCategoriaScalarWhereWithAggregatesInput | ReceitaCategoriaScalarWhereWithAggregatesInput[]
    OR?: ReceitaCategoriaScalarWhereWithAggregatesInput[]
    NOT?: ReceitaCategoriaScalarWhereWithAggregatesInput | ReceitaCategoriaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ReceitaCategoria"> | string
    dashboardId?: StringWithAggregatesFilter<"ReceitaCategoria"> | string
    categoria?: StringWithAggregatesFilter<"ReceitaCategoria"> | string
    receita?: DecimalWithAggregatesFilter<"ReceitaCategoria"> | Decimal | DecimalJsLike | number | string
  }

  export type ReceitaMetodoPagamentoWhereInput = {
    AND?: ReceitaMetodoPagamentoWhereInput | ReceitaMetodoPagamentoWhereInput[]
    OR?: ReceitaMetodoPagamentoWhereInput[]
    NOT?: ReceitaMetodoPagamentoWhereInput | ReceitaMetodoPagamentoWhereInput[]
    id?: StringFilter<"ReceitaMetodoPagamento"> | string
    dashboardId?: StringFilter<"ReceitaMetodoPagamento"> | string
    metodoPagamento?: StringFilter<"ReceitaMetodoPagamento"> | string
    receita?: DecimalFilter<"ReceitaMetodoPagamento"> | Decimal | DecimalJsLike | number | string
    dashboard?: XOR<DashboardComercialScalarRelationFilter, DashboardComercialWhereInput>
  }

  export type ReceitaMetodoPagamentoOrderByWithRelationInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    metodoPagamento?: SortOrder
    receita?: SortOrder
    dashboard?: DashboardComercialOrderByWithRelationInput
  }

  export type ReceitaMetodoPagamentoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ReceitaMetodoPagamentoWhereInput | ReceitaMetodoPagamentoWhereInput[]
    OR?: ReceitaMetodoPagamentoWhereInput[]
    NOT?: ReceitaMetodoPagamentoWhereInput | ReceitaMetodoPagamentoWhereInput[]
    dashboardId?: StringFilter<"ReceitaMetodoPagamento"> | string
    metodoPagamento?: StringFilter<"ReceitaMetodoPagamento"> | string
    receita?: DecimalFilter<"ReceitaMetodoPagamento"> | Decimal | DecimalJsLike | number | string
    dashboard?: XOR<DashboardComercialScalarRelationFilter, DashboardComercialWhereInput>
  }, "id">

  export type ReceitaMetodoPagamentoOrderByWithAggregationInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    metodoPagamento?: SortOrder
    receita?: SortOrder
    _count?: ReceitaMetodoPagamentoCountOrderByAggregateInput
    _avg?: ReceitaMetodoPagamentoAvgOrderByAggregateInput
    _max?: ReceitaMetodoPagamentoMaxOrderByAggregateInput
    _min?: ReceitaMetodoPagamentoMinOrderByAggregateInput
    _sum?: ReceitaMetodoPagamentoSumOrderByAggregateInput
  }

  export type ReceitaMetodoPagamentoScalarWhereWithAggregatesInput = {
    AND?: ReceitaMetodoPagamentoScalarWhereWithAggregatesInput | ReceitaMetodoPagamentoScalarWhereWithAggregatesInput[]
    OR?: ReceitaMetodoPagamentoScalarWhereWithAggregatesInput[]
    NOT?: ReceitaMetodoPagamentoScalarWhereWithAggregatesInput | ReceitaMetodoPagamentoScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ReceitaMetodoPagamento"> | string
    dashboardId?: StringWithAggregatesFilter<"ReceitaMetodoPagamento"> | string
    metodoPagamento?: StringWithAggregatesFilter<"ReceitaMetodoPagamento"> | string
    receita?: DecimalWithAggregatesFilter<"ReceitaMetodoPagamento"> | Decimal | DecimalJsLike | number | string
  }

  export type ClientesRecorrentesVsUnicosWhereInput = {
    AND?: ClientesRecorrentesVsUnicosWhereInput | ClientesRecorrentesVsUnicosWhereInput[]
    OR?: ClientesRecorrentesVsUnicosWhereInput[]
    NOT?: ClientesRecorrentesVsUnicosWhereInput | ClientesRecorrentesVsUnicosWhereInput[]
    id?: StringFilter<"ClientesRecorrentesVsUnicos"> | string
    dashboardId?: StringFilter<"ClientesRecorrentesVsUnicos"> | string
    tipoCliente?: StringFilter<"ClientesRecorrentesVsUnicos"> | string
    quantidade?: IntFilter<"ClientesRecorrentesVsUnicos"> | number
    dashboard?: XOR<DashboardComercialScalarRelationFilter, DashboardComercialWhereInput>
  }

  export type ClientesRecorrentesVsUnicosOrderByWithRelationInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    tipoCliente?: SortOrder
    quantidade?: SortOrder
    dashboard?: DashboardComercialOrderByWithRelationInput
  }

  export type ClientesRecorrentesVsUnicosWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ClientesRecorrentesVsUnicosWhereInput | ClientesRecorrentesVsUnicosWhereInput[]
    OR?: ClientesRecorrentesVsUnicosWhereInput[]
    NOT?: ClientesRecorrentesVsUnicosWhereInput | ClientesRecorrentesVsUnicosWhereInput[]
    dashboardId?: StringFilter<"ClientesRecorrentesVsUnicos"> | string
    tipoCliente?: StringFilter<"ClientesRecorrentesVsUnicos"> | string
    quantidade?: IntFilter<"ClientesRecorrentesVsUnicos"> | number
    dashboard?: XOR<DashboardComercialScalarRelationFilter, DashboardComercialWhereInput>
  }, "id">

  export type ClientesRecorrentesVsUnicosOrderByWithAggregationInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    tipoCliente?: SortOrder
    quantidade?: SortOrder
    _count?: ClientesRecorrentesVsUnicosCountOrderByAggregateInput
    _avg?: ClientesRecorrentesVsUnicosAvgOrderByAggregateInput
    _max?: ClientesRecorrentesVsUnicosMaxOrderByAggregateInput
    _min?: ClientesRecorrentesVsUnicosMinOrderByAggregateInput
    _sum?: ClientesRecorrentesVsUnicosSumOrderByAggregateInput
  }

  export type ClientesRecorrentesVsUnicosScalarWhereWithAggregatesInput = {
    AND?: ClientesRecorrentesVsUnicosScalarWhereWithAggregatesInput | ClientesRecorrentesVsUnicosScalarWhereWithAggregatesInput[]
    OR?: ClientesRecorrentesVsUnicosScalarWhereWithAggregatesInput[]
    NOT?: ClientesRecorrentesVsUnicosScalarWhereWithAggregatesInput | ClientesRecorrentesVsUnicosScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ClientesRecorrentesVsUnicos"> | string
    dashboardId?: StringWithAggregatesFilter<"ClientesRecorrentesVsUnicos"> | string
    tipoCliente?: StringWithAggregatesFilter<"ClientesRecorrentesVsUnicos"> | string
    quantidade?: IntWithAggregatesFilter<"ClientesRecorrentesVsUnicos"> | number
  }

  export type ProdutoRankWhereInput = {
    AND?: ProdutoRankWhereInput | ProdutoRankWhereInput[]
    OR?: ProdutoRankWhereInput[]
    NOT?: ProdutoRankWhereInput | ProdutoRankWhereInput[]
    id?: StringFilter<"ProdutoRank"> | string
    dashboardId?: StringFilter<"ProdutoRank"> | string
    produto?: StringFilter<"ProdutoRank"> | string
    vendas?: IntFilter<"ProdutoRank"> | number
    dashboard?: XOR<DashboardComercialScalarRelationFilter, DashboardComercialWhereInput>
  }

  export type ProdutoRankOrderByWithRelationInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    produto?: SortOrder
    vendas?: SortOrder
    dashboard?: DashboardComercialOrderByWithRelationInput
  }

  export type ProdutoRankWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProdutoRankWhereInput | ProdutoRankWhereInput[]
    OR?: ProdutoRankWhereInput[]
    NOT?: ProdutoRankWhereInput | ProdutoRankWhereInput[]
    dashboardId?: StringFilter<"ProdutoRank"> | string
    produto?: StringFilter<"ProdutoRank"> | string
    vendas?: IntFilter<"ProdutoRank"> | number
    dashboard?: XOR<DashboardComercialScalarRelationFilter, DashboardComercialWhereInput>
  }, "id">

  export type ProdutoRankOrderByWithAggregationInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    produto?: SortOrder
    vendas?: SortOrder
    _count?: ProdutoRankCountOrderByAggregateInput
    _avg?: ProdutoRankAvgOrderByAggregateInput
    _max?: ProdutoRankMaxOrderByAggregateInput
    _min?: ProdutoRankMinOrderByAggregateInput
    _sum?: ProdutoRankSumOrderByAggregateInput
  }

  export type ProdutoRankScalarWhereWithAggregatesInput = {
    AND?: ProdutoRankScalarWhereWithAggregatesInput | ProdutoRankScalarWhereWithAggregatesInput[]
    OR?: ProdutoRankScalarWhereWithAggregatesInput[]
    NOT?: ProdutoRankScalarWhereWithAggregatesInput | ProdutoRankScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProdutoRank"> | string
    dashboardId?: StringWithAggregatesFilter<"ProdutoRank"> | string
    produto?: StringWithAggregatesFilter<"ProdutoRank"> | string
    vendas?: IntWithAggregatesFilter<"ProdutoRank"> | number
  }

  export type OrganizationCreateInput = {
    id?: string
    name: string
    googleAccessToken?: string | null
    googleRefreshToken?: string | null
    googleScopes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    googleExpiresIn?: number | null
    dashboardComercial?: DashboardComercialCreateNestedOneWithoutOrganizationInput
    dashboardMarketing?: DashboardMarketingCreateNestedOneWithoutOrganizationInput
    users?: UserCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationUncheckedCreateInput = {
    id?: string
    name: string
    googleAccessToken?: string | null
    googleRefreshToken?: string | null
    googleScopes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    googleExpiresIn?: number | null
    dashboardComercial?: DashboardComercialUncheckedCreateNestedOneWithoutOrganizationInput
    dashboardMarketing?: DashboardMarketingUncheckedCreateNestedOneWithoutOrganizationInput
    users?: UserUncheckedCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    googleAccessToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleRefreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleScopes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    googleExpiresIn?: NullableFloatFieldUpdateOperationsInput | number | null
    dashboardComercial?: DashboardComercialUpdateOneWithoutOrganizationNestedInput
    dashboardMarketing?: DashboardMarketingUpdateOneWithoutOrganizationNestedInput
    users?: UserUpdateManyWithoutOrganizationNestedInput
  }

  export type OrganizationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    googleAccessToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleRefreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleScopes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    googleExpiresIn?: NullableFloatFieldUpdateOperationsInput | number | null
    dashboardComercial?: DashboardComercialUncheckedUpdateOneWithoutOrganizationNestedInput
    dashboardMarketing?: DashboardMarketingUncheckedUpdateOneWithoutOrganizationNestedInput
    users?: UserUncheckedUpdateManyWithoutOrganizationNestedInput
  }

  export type OrganizationCreateManyInput = {
    id?: string
    name: string
    googleAccessToken?: string | null
    googleRefreshToken?: string | null
    googleScopes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    googleExpiresIn?: number | null
  }

  export type OrganizationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    googleAccessToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleRefreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleScopes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    googleExpiresIn?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type OrganizationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    googleAccessToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleRefreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleScopes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    googleExpiresIn?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type UserCreateInput = {
    id?: string
    name: string
    email: string
    password: string
    role: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    organization: OrganizationCreateNestedOneWithoutUsersInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    password: string
    role: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    organizationId: string
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organization?: OrganizationUpdateOneRequiredWithoutUsersNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organizationId?: StringFieldUpdateOperationsInput | string
  }

  export type UserCreateManyInput = {
    id?: string
    name: string
    email: string
    password: string
    role: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    organizationId: string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organizationId?: StringFieldUpdateOperationsInput | string
  }

  export type PedidoCreateInput = {
    id?: string
    dataPedido: Date | string
    dataAprovacao: Date | string
    cancelada: boolean
    faturado: boolean
    codigoPedido: string
    codigoProduto: string
    setor: string
    produto: string
    precoUnitario: Decimal | DecimalJsLike | number | string
    quantidade: Decimal | DecimalJsLike | number | string
    valorTotal: Decimal | DecimalJsLike | number | string
    cliente: string
    vendedor: string
  }

  export type PedidoUncheckedCreateInput = {
    id?: string
    dataPedido: Date | string
    dataAprovacao: Date | string
    cancelada: boolean
    faturado: boolean
    codigoPedido: string
    codigoProduto: string
    setor: string
    produto: string
    precoUnitario: Decimal | DecimalJsLike | number | string
    quantidade: Decimal | DecimalJsLike | number | string
    valorTotal: Decimal | DecimalJsLike | number | string
    cliente: string
    vendedor: string
  }

  export type PedidoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    dataPedido?: DateTimeFieldUpdateOperationsInput | Date | string
    dataAprovacao?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelada?: BoolFieldUpdateOperationsInput | boolean
    faturado?: BoolFieldUpdateOperationsInput | boolean
    codigoPedido?: StringFieldUpdateOperationsInput | string
    codigoProduto?: StringFieldUpdateOperationsInput | string
    setor?: StringFieldUpdateOperationsInput | string
    produto?: StringFieldUpdateOperationsInput | string
    precoUnitario?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    quantidade?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cliente?: StringFieldUpdateOperationsInput | string
    vendedor?: StringFieldUpdateOperationsInput | string
  }

  export type PedidoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    dataPedido?: DateTimeFieldUpdateOperationsInput | Date | string
    dataAprovacao?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelada?: BoolFieldUpdateOperationsInput | boolean
    faturado?: BoolFieldUpdateOperationsInput | boolean
    codigoPedido?: StringFieldUpdateOperationsInput | string
    codigoProduto?: StringFieldUpdateOperationsInput | string
    setor?: StringFieldUpdateOperationsInput | string
    produto?: StringFieldUpdateOperationsInput | string
    precoUnitario?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    quantidade?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cliente?: StringFieldUpdateOperationsInput | string
    vendedor?: StringFieldUpdateOperationsInput | string
  }

  export type PedidoCreateManyInput = {
    id?: string
    dataPedido: Date | string
    dataAprovacao: Date | string
    cancelada: boolean
    faturado: boolean
    codigoPedido: string
    codigoProduto: string
    setor: string
    produto: string
    precoUnitario: Decimal | DecimalJsLike | number | string
    quantidade: Decimal | DecimalJsLike | number | string
    valorTotal: Decimal | DecimalJsLike | number | string
    cliente: string
    vendedor: string
  }

  export type PedidoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    dataPedido?: DateTimeFieldUpdateOperationsInput | Date | string
    dataAprovacao?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelada?: BoolFieldUpdateOperationsInput | boolean
    faturado?: BoolFieldUpdateOperationsInput | boolean
    codigoPedido?: StringFieldUpdateOperationsInput | string
    codigoProduto?: StringFieldUpdateOperationsInput | string
    setor?: StringFieldUpdateOperationsInput | string
    produto?: StringFieldUpdateOperationsInput | string
    precoUnitario?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    quantidade?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cliente?: StringFieldUpdateOperationsInput | string
    vendedor?: StringFieldUpdateOperationsInput | string
  }

  export type PedidoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    dataPedido?: DateTimeFieldUpdateOperationsInput | Date | string
    dataAprovacao?: DateTimeFieldUpdateOperationsInput | Date | string
    cancelada?: BoolFieldUpdateOperationsInput | boolean
    faturado?: BoolFieldUpdateOperationsInput | boolean
    codigoPedido?: StringFieldUpdateOperationsInput | string
    codigoProduto?: StringFieldUpdateOperationsInput | string
    setor?: StringFieldUpdateOperationsInput | string
    produto?: StringFieldUpdateOperationsInput | string
    precoUnitario?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    quantidade?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    cliente?: StringFieldUpdateOperationsInput | string
    vendedor?: StringFieldUpdateOperationsInput | string
  }

  export type DashboardMarketingCreateInput = {
    id?: string
    sessoes: number
    usuarios: number
    taxaRejeicao: number
    taxaConversaoSite: number
    taxaAbandonoCarrinho: number
    impressoes: number
    cliques: number
    ctr: number
    cpc: Decimal | DecimalJsLike | number | string
    conversoes: number
    custoPorConversao: Decimal | DecimalJsLike | number | string
    roas: number
    custoPorLead: Decimal | DecimalJsLike | number | string
    faturamentoTotal: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    anunciosCTR?: AnuncioCTRCreateNestedManyWithoutDashboardInput
    anunciosConv?: AnuncioConversaoCreateNestedManyWithoutDashboardInput
    canais?: CanalTrafegoCreateNestedManyWithoutDashboardInput
    organization: OrganizationCreateNestedOneWithoutDashboardMarketingInput
    palavrasChave?: PalavraChaveCreateNestedManyWithoutDashboardInput
    trafego?: TrafegoCreateNestedManyWithoutDashboardInput
  }

  export type DashboardMarketingUncheckedCreateInput = {
    id?: string
    organizationId: string
    sessoes: number
    usuarios: number
    taxaRejeicao: number
    taxaConversaoSite: number
    taxaAbandonoCarrinho: number
    impressoes: number
    cliques: number
    ctr: number
    cpc: Decimal | DecimalJsLike | number | string
    conversoes: number
    custoPorConversao: Decimal | DecimalJsLike | number | string
    roas: number
    custoPorLead: Decimal | DecimalJsLike | number | string
    faturamentoTotal: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    anunciosCTR?: AnuncioCTRUncheckedCreateNestedManyWithoutDashboardInput
    anunciosConv?: AnuncioConversaoUncheckedCreateNestedManyWithoutDashboardInput
    canais?: CanalTrafegoUncheckedCreateNestedManyWithoutDashboardInput
    palavrasChave?: PalavraChaveUncheckedCreateNestedManyWithoutDashboardInput
    trafego?: TrafegoUncheckedCreateNestedManyWithoutDashboardInput
  }

  export type DashboardMarketingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessoes?: IntFieldUpdateOperationsInput | number
    usuarios?: IntFieldUpdateOperationsInput | number
    taxaRejeicao?: FloatFieldUpdateOperationsInput | number
    taxaConversaoSite?: FloatFieldUpdateOperationsInput | number
    taxaAbandonoCarrinho?: FloatFieldUpdateOperationsInput | number
    impressoes?: IntFieldUpdateOperationsInput | number
    cliques?: IntFieldUpdateOperationsInput | number
    ctr?: FloatFieldUpdateOperationsInput | number
    cpc?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    conversoes?: IntFieldUpdateOperationsInput | number
    custoPorConversao?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    roas?: FloatFieldUpdateOperationsInput | number
    custoPorLead?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    faturamentoTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    anunciosCTR?: AnuncioCTRUpdateManyWithoutDashboardNestedInput
    anunciosConv?: AnuncioConversaoUpdateManyWithoutDashboardNestedInput
    canais?: CanalTrafegoUpdateManyWithoutDashboardNestedInput
    organization?: OrganizationUpdateOneRequiredWithoutDashboardMarketingNestedInput
    palavrasChave?: PalavraChaveUpdateManyWithoutDashboardNestedInput
    trafego?: TrafegoUpdateManyWithoutDashboardNestedInput
  }

  export type DashboardMarketingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    sessoes?: IntFieldUpdateOperationsInput | number
    usuarios?: IntFieldUpdateOperationsInput | number
    taxaRejeicao?: FloatFieldUpdateOperationsInput | number
    taxaConversaoSite?: FloatFieldUpdateOperationsInput | number
    taxaAbandonoCarrinho?: FloatFieldUpdateOperationsInput | number
    impressoes?: IntFieldUpdateOperationsInput | number
    cliques?: IntFieldUpdateOperationsInput | number
    ctr?: FloatFieldUpdateOperationsInput | number
    cpc?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    conversoes?: IntFieldUpdateOperationsInput | number
    custoPorConversao?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    roas?: FloatFieldUpdateOperationsInput | number
    custoPorLead?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    faturamentoTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    anunciosCTR?: AnuncioCTRUncheckedUpdateManyWithoutDashboardNestedInput
    anunciosConv?: AnuncioConversaoUncheckedUpdateManyWithoutDashboardNestedInput
    canais?: CanalTrafegoUncheckedUpdateManyWithoutDashboardNestedInput
    palavrasChave?: PalavraChaveUncheckedUpdateManyWithoutDashboardNestedInput
    trafego?: TrafegoUncheckedUpdateManyWithoutDashboardNestedInput
  }

  export type DashboardMarketingCreateManyInput = {
    id?: string
    organizationId: string
    sessoes: number
    usuarios: number
    taxaRejeicao: number
    taxaConversaoSite: number
    taxaAbandonoCarrinho: number
    impressoes: number
    cliques: number
    ctr: number
    cpc: Decimal | DecimalJsLike | number | string
    conversoes: number
    custoPorConversao: Decimal | DecimalJsLike | number | string
    roas: number
    custoPorLead: Decimal | DecimalJsLike | number | string
    faturamentoTotal: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DashboardMarketingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessoes?: IntFieldUpdateOperationsInput | number
    usuarios?: IntFieldUpdateOperationsInput | number
    taxaRejeicao?: FloatFieldUpdateOperationsInput | number
    taxaConversaoSite?: FloatFieldUpdateOperationsInput | number
    taxaAbandonoCarrinho?: FloatFieldUpdateOperationsInput | number
    impressoes?: IntFieldUpdateOperationsInput | number
    cliques?: IntFieldUpdateOperationsInput | number
    ctr?: FloatFieldUpdateOperationsInput | number
    cpc?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    conversoes?: IntFieldUpdateOperationsInput | number
    custoPorConversao?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    roas?: FloatFieldUpdateOperationsInput | number
    custoPorLead?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    faturamentoTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DashboardMarketingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    sessoes?: IntFieldUpdateOperationsInput | number
    usuarios?: IntFieldUpdateOperationsInput | number
    taxaRejeicao?: FloatFieldUpdateOperationsInput | number
    taxaConversaoSite?: FloatFieldUpdateOperationsInput | number
    taxaAbandonoCarrinho?: FloatFieldUpdateOperationsInput | number
    impressoes?: IntFieldUpdateOperationsInput | number
    cliques?: IntFieldUpdateOperationsInput | number
    ctr?: FloatFieldUpdateOperationsInput | number
    cpc?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    conversoes?: IntFieldUpdateOperationsInput | number
    custoPorConversao?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    roas?: FloatFieldUpdateOperationsInput | number
    custoPorLead?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    faturamentoTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrafegoCreateInput = {
    id?: string
    origem: string
    valor: number
    dashboard: DashboardMarketingCreateNestedOneWithoutTrafegoInput
  }

  export type TrafegoUncheckedCreateInput = {
    id?: string
    dashboardId: string
    origem: string
    valor: number
  }

  export type TrafegoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    origem?: StringFieldUpdateOperationsInput | string
    valor?: IntFieldUpdateOperationsInput | number
    dashboard?: DashboardMarketingUpdateOneRequiredWithoutTrafegoNestedInput
  }

  export type TrafegoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    dashboardId?: StringFieldUpdateOperationsInput | string
    origem?: StringFieldUpdateOperationsInput | string
    valor?: IntFieldUpdateOperationsInput | number
  }

  export type TrafegoCreateManyInput = {
    id?: string
    dashboardId: string
    origem: string
    valor: number
  }

  export type TrafegoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    origem?: StringFieldUpdateOperationsInput | string
    valor?: IntFieldUpdateOperationsInput | number
  }

  export type TrafegoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    dashboardId?: StringFieldUpdateOperationsInput | string
    origem?: StringFieldUpdateOperationsInput | string
    valor?: IntFieldUpdateOperationsInput | number
  }

  export type CanalTrafegoCreateInput = {
    id?: string
    canal: string
    taxaConversao: number
    cpa: Decimal | DecimalJsLike | number | string
    roi: number
    dashboard: DashboardMarketingCreateNestedOneWithoutCanaisInput
  }

  export type CanalTrafegoUncheckedCreateInput = {
    id?: string
    dashboardId: string
    canal: string
    taxaConversao: number
    cpa: Decimal | DecimalJsLike | number | string
    roi: number
  }

  export type CanalTrafegoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    canal?: StringFieldUpdateOperationsInput | string
    taxaConversao?: FloatFieldUpdateOperationsInput | number
    cpa?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    roi?: FloatFieldUpdateOperationsInput | number
    dashboard?: DashboardMarketingUpdateOneRequiredWithoutCanaisNestedInput
  }

  export type CanalTrafegoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    dashboardId?: StringFieldUpdateOperationsInput | string
    canal?: StringFieldUpdateOperationsInput | string
    taxaConversao?: FloatFieldUpdateOperationsInput | number
    cpa?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    roi?: FloatFieldUpdateOperationsInput | number
  }

  export type CanalTrafegoCreateManyInput = {
    id?: string
    dashboardId: string
    canal: string
    taxaConversao: number
    cpa: Decimal | DecimalJsLike | number | string
    roi: number
  }

  export type CanalTrafegoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    canal?: StringFieldUpdateOperationsInput | string
    taxaConversao?: FloatFieldUpdateOperationsInput | number
    cpa?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    roi?: FloatFieldUpdateOperationsInput | number
  }

  export type CanalTrafegoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    dashboardId?: StringFieldUpdateOperationsInput | string
    canal?: StringFieldUpdateOperationsInput | string
    taxaConversao?: FloatFieldUpdateOperationsInput | number
    cpa?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    roi?: FloatFieldUpdateOperationsInput | number
  }

  export type AnuncioCTRCreateInput = {
    id?: string
    nome: string
    ctr: number
    dashboard: DashboardMarketingCreateNestedOneWithoutAnunciosCTRInput
  }

  export type AnuncioCTRUncheckedCreateInput = {
    id?: string
    dashboardId: string
    nome: string
    ctr: number
  }

  export type AnuncioCTRUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    ctr?: FloatFieldUpdateOperationsInput | number
    dashboard?: DashboardMarketingUpdateOneRequiredWithoutAnunciosCTRNestedInput
  }

  export type AnuncioCTRUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    dashboardId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    ctr?: FloatFieldUpdateOperationsInput | number
  }

  export type AnuncioCTRCreateManyInput = {
    id?: string
    dashboardId: string
    nome: string
    ctr: number
  }

  export type AnuncioCTRUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    ctr?: FloatFieldUpdateOperationsInput | number
  }

  export type AnuncioCTRUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    dashboardId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    ctr?: FloatFieldUpdateOperationsInput | number
  }

  export type AnuncioConversaoCreateInput = {
    id?: string
    nome: string
    conversoes: number
    dashboard: DashboardMarketingCreateNestedOneWithoutAnunciosConvInput
  }

  export type AnuncioConversaoUncheckedCreateInput = {
    id?: string
    dashboardId: string
    nome: string
    conversoes: number
  }

  export type AnuncioConversaoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    conversoes?: IntFieldUpdateOperationsInput | number
    dashboard?: DashboardMarketingUpdateOneRequiredWithoutAnunciosConvNestedInput
  }

  export type AnuncioConversaoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    dashboardId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    conversoes?: IntFieldUpdateOperationsInput | number
  }

  export type AnuncioConversaoCreateManyInput = {
    id?: string
    dashboardId: string
    nome: string
    conversoes: number
  }

  export type AnuncioConversaoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    conversoes?: IntFieldUpdateOperationsInput | number
  }

  export type AnuncioConversaoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    dashboardId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    conversoes?: IntFieldUpdateOperationsInput | number
  }

  export type PalavraChaveCreateInput = {
    id?: string
    palavra: string
    ctr: number
    dashboard: DashboardMarketingCreateNestedOneWithoutPalavrasChaveInput
  }

  export type PalavraChaveUncheckedCreateInput = {
    id?: string
    dashboardId: string
    palavra: string
    ctr: number
  }

  export type PalavraChaveUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    palavra?: StringFieldUpdateOperationsInput | string
    ctr?: FloatFieldUpdateOperationsInput | number
    dashboard?: DashboardMarketingUpdateOneRequiredWithoutPalavrasChaveNestedInput
  }

  export type PalavraChaveUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    dashboardId?: StringFieldUpdateOperationsInput | string
    palavra?: StringFieldUpdateOperationsInput | string
    ctr?: FloatFieldUpdateOperationsInput | number
  }

  export type PalavraChaveCreateManyInput = {
    id?: string
    dashboardId: string
    palavra: string
    ctr: number
  }

  export type PalavraChaveUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    palavra?: StringFieldUpdateOperationsInput | string
    ctr?: FloatFieldUpdateOperationsInput | number
  }

  export type PalavraChaveUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    dashboardId?: StringFieldUpdateOperationsInput | string
    palavra?: StringFieldUpdateOperationsInput | string
    ctr?: FloatFieldUpdateOperationsInput | number
  }

  export type DashboardComercialCreateInput = {
    id?: string
    receitaTotal: Decimal | DecimalJsLike | number | string
    ticketMedio: Decimal | DecimalJsLike | number | string
    crescimentoReceita: number
    novosClientes: number
    taxaRetencaoClientes: number
    clv: Decimal | DecimalJsLike | number | string
    volumeReparos: number
    taxaReincidenciaReparos: number
    receitaReparosVsVendas: number
    createdAt?: Date | string
    updatedAt?: Date | string
    clientesComparacao?: ClientesRecorrentesVsUnicosCreateNestedManyWithoutDashboardInput
    organization: OrganizationCreateNestedOneWithoutDashboardComercialInput
    produtosTop?: ProdutoRankCreateNestedManyWithoutDashboardInput
    receitaPorCategoria?: ReceitaCategoriaCreateNestedManyWithoutDashboardInput
    receitaPorPagamento?: ReceitaMetodoPagamentoCreateNestedManyWithoutDashboardInput
  }

  export type DashboardComercialUncheckedCreateInput = {
    id?: string
    organizationId: string
    receitaTotal: Decimal | DecimalJsLike | number | string
    ticketMedio: Decimal | DecimalJsLike | number | string
    crescimentoReceita: number
    novosClientes: number
    taxaRetencaoClientes: number
    clv: Decimal | DecimalJsLike | number | string
    volumeReparos: number
    taxaReincidenciaReparos: number
    receitaReparosVsVendas: number
    createdAt?: Date | string
    updatedAt?: Date | string
    clientesComparacao?: ClientesRecorrentesVsUnicosUncheckedCreateNestedManyWithoutDashboardInput
    produtosTop?: ProdutoRankUncheckedCreateNestedManyWithoutDashboardInput
    receitaPorCategoria?: ReceitaCategoriaUncheckedCreateNestedManyWithoutDashboardInput
    receitaPorPagamento?: ReceitaMetodoPagamentoUncheckedCreateNestedManyWithoutDashboardInput
  }

  export type DashboardComercialUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    receitaTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ticketMedio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    crescimentoReceita?: FloatFieldUpdateOperationsInput | number
    novosClientes?: IntFieldUpdateOperationsInput | number
    taxaRetencaoClientes?: FloatFieldUpdateOperationsInput | number
    clv?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    volumeReparos?: IntFieldUpdateOperationsInput | number
    taxaReincidenciaReparos?: FloatFieldUpdateOperationsInput | number
    receitaReparosVsVendas?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clientesComparacao?: ClientesRecorrentesVsUnicosUpdateManyWithoutDashboardNestedInput
    organization?: OrganizationUpdateOneRequiredWithoutDashboardComercialNestedInput
    produtosTop?: ProdutoRankUpdateManyWithoutDashboardNestedInput
    receitaPorCategoria?: ReceitaCategoriaUpdateManyWithoutDashboardNestedInput
    receitaPorPagamento?: ReceitaMetodoPagamentoUpdateManyWithoutDashboardNestedInput
  }

  export type DashboardComercialUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    receitaTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ticketMedio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    crescimentoReceita?: FloatFieldUpdateOperationsInput | number
    novosClientes?: IntFieldUpdateOperationsInput | number
    taxaRetencaoClientes?: FloatFieldUpdateOperationsInput | number
    clv?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    volumeReparos?: IntFieldUpdateOperationsInput | number
    taxaReincidenciaReparos?: FloatFieldUpdateOperationsInput | number
    receitaReparosVsVendas?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clientesComparacao?: ClientesRecorrentesVsUnicosUncheckedUpdateManyWithoutDashboardNestedInput
    produtosTop?: ProdutoRankUncheckedUpdateManyWithoutDashboardNestedInput
    receitaPorCategoria?: ReceitaCategoriaUncheckedUpdateManyWithoutDashboardNestedInput
    receitaPorPagamento?: ReceitaMetodoPagamentoUncheckedUpdateManyWithoutDashboardNestedInput
  }

  export type DashboardComercialCreateManyInput = {
    id?: string
    organizationId: string
    receitaTotal: Decimal | DecimalJsLike | number | string
    ticketMedio: Decimal | DecimalJsLike | number | string
    crescimentoReceita: number
    novosClientes: number
    taxaRetencaoClientes: number
    clv: Decimal | DecimalJsLike | number | string
    volumeReparos: number
    taxaReincidenciaReparos: number
    receitaReparosVsVendas: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DashboardComercialUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    receitaTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ticketMedio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    crescimentoReceita?: FloatFieldUpdateOperationsInput | number
    novosClientes?: IntFieldUpdateOperationsInput | number
    taxaRetencaoClientes?: FloatFieldUpdateOperationsInput | number
    clv?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    volumeReparos?: IntFieldUpdateOperationsInput | number
    taxaReincidenciaReparos?: FloatFieldUpdateOperationsInput | number
    receitaReparosVsVendas?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DashboardComercialUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    receitaTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ticketMedio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    crescimentoReceita?: FloatFieldUpdateOperationsInput | number
    novosClientes?: IntFieldUpdateOperationsInput | number
    taxaRetencaoClientes?: FloatFieldUpdateOperationsInput | number
    clv?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    volumeReparos?: IntFieldUpdateOperationsInput | number
    taxaReincidenciaReparos?: FloatFieldUpdateOperationsInput | number
    receitaReparosVsVendas?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReceitaCategoriaCreateInput = {
    id?: string
    categoria: string
    receita: Decimal | DecimalJsLike | number | string
    dashboard: DashboardComercialCreateNestedOneWithoutReceitaPorCategoriaInput
  }

  export type ReceitaCategoriaUncheckedCreateInput = {
    id?: string
    dashboardId: string
    categoria: string
    receita: Decimal | DecimalJsLike | number | string
  }

  export type ReceitaCategoriaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    categoria?: StringFieldUpdateOperationsInput | string
    receita?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dashboard?: DashboardComercialUpdateOneRequiredWithoutReceitaPorCategoriaNestedInput
  }

  export type ReceitaCategoriaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    dashboardId?: StringFieldUpdateOperationsInput | string
    categoria?: StringFieldUpdateOperationsInput | string
    receita?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type ReceitaCategoriaCreateManyInput = {
    id?: string
    dashboardId: string
    categoria: string
    receita: Decimal | DecimalJsLike | number | string
  }

  export type ReceitaCategoriaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    categoria?: StringFieldUpdateOperationsInput | string
    receita?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type ReceitaCategoriaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    dashboardId?: StringFieldUpdateOperationsInput | string
    categoria?: StringFieldUpdateOperationsInput | string
    receita?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type ReceitaMetodoPagamentoCreateInput = {
    id?: string
    metodoPagamento: string
    receita: Decimal | DecimalJsLike | number | string
    dashboard: DashboardComercialCreateNestedOneWithoutReceitaPorPagamentoInput
  }

  export type ReceitaMetodoPagamentoUncheckedCreateInput = {
    id?: string
    dashboardId: string
    metodoPagamento: string
    receita: Decimal | DecimalJsLike | number | string
  }

  export type ReceitaMetodoPagamentoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    metodoPagamento?: StringFieldUpdateOperationsInput | string
    receita?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dashboard?: DashboardComercialUpdateOneRequiredWithoutReceitaPorPagamentoNestedInput
  }

  export type ReceitaMetodoPagamentoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    dashboardId?: StringFieldUpdateOperationsInput | string
    metodoPagamento?: StringFieldUpdateOperationsInput | string
    receita?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type ReceitaMetodoPagamentoCreateManyInput = {
    id?: string
    dashboardId: string
    metodoPagamento: string
    receita: Decimal | DecimalJsLike | number | string
  }

  export type ReceitaMetodoPagamentoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    metodoPagamento?: StringFieldUpdateOperationsInput | string
    receita?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type ReceitaMetodoPagamentoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    dashboardId?: StringFieldUpdateOperationsInput | string
    metodoPagamento?: StringFieldUpdateOperationsInput | string
    receita?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type ClientesRecorrentesVsUnicosCreateInput = {
    id?: string
    tipoCliente: string
    quantidade: number
    dashboard: DashboardComercialCreateNestedOneWithoutClientesComparacaoInput
  }

  export type ClientesRecorrentesVsUnicosUncheckedCreateInput = {
    id?: string
    dashboardId: string
    tipoCliente: string
    quantidade: number
  }

  export type ClientesRecorrentesVsUnicosUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipoCliente?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    dashboard?: DashboardComercialUpdateOneRequiredWithoutClientesComparacaoNestedInput
  }

  export type ClientesRecorrentesVsUnicosUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    dashboardId?: StringFieldUpdateOperationsInput | string
    tipoCliente?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
  }

  export type ClientesRecorrentesVsUnicosCreateManyInput = {
    id?: string
    dashboardId: string
    tipoCliente: string
    quantidade: number
  }

  export type ClientesRecorrentesVsUnicosUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipoCliente?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
  }

  export type ClientesRecorrentesVsUnicosUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    dashboardId?: StringFieldUpdateOperationsInput | string
    tipoCliente?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
  }

  export type ProdutoRankCreateInput = {
    id?: string
    produto: string
    vendas: number
    dashboard: DashboardComercialCreateNestedOneWithoutProdutosTopInput
  }

  export type ProdutoRankUncheckedCreateInput = {
    id?: string
    dashboardId: string
    produto: string
    vendas: number
  }

  export type ProdutoRankUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    produto?: StringFieldUpdateOperationsInput | string
    vendas?: IntFieldUpdateOperationsInput | number
    dashboard?: DashboardComercialUpdateOneRequiredWithoutProdutosTopNestedInput
  }

  export type ProdutoRankUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    dashboardId?: StringFieldUpdateOperationsInput | string
    produto?: StringFieldUpdateOperationsInput | string
    vendas?: IntFieldUpdateOperationsInput | number
  }

  export type ProdutoRankCreateManyInput = {
    id?: string
    dashboardId: string
    produto: string
    vendas: number
  }

  export type ProdutoRankUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    produto?: StringFieldUpdateOperationsInput | string
    vendas?: IntFieldUpdateOperationsInput | number
  }

  export type ProdutoRankUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    dashboardId?: StringFieldUpdateOperationsInput | string
    produto?: StringFieldUpdateOperationsInput | string
    vendas?: IntFieldUpdateOperationsInput | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type DashboardComercialNullableScalarRelationFilter = {
    is?: DashboardComercialWhereInput | null
    isNot?: DashboardComercialWhereInput | null
  }

  export type DashboardMarketingNullableScalarRelationFilter = {
    is?: DashboardMarketingWhereInput | null
    isNot?: DashboardMarketingWhereInput | null
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OrganizationCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    googleAccessToken?: SortOrder
    googleRefreshToken?: SortOrder
    googleScopes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    googleExpiresIn?: SortOrder
  }

  export type OrganizationAvgOrderByAggregateInput = {
    googleExpiresIn?: SortOrder
  }

  export type OrganizationMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    googleAccessToken?: SortOrder
    googleRefreshToken?: SortOrder
    googleScopes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    googleExpiresIn?: SortOrder
  }

  export type OrganizationMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    googleAccessToken?: SortOrder
    googleRefreshToken?: SortOrder
    googleScopes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    googleExpiresIn?: SortOrder
  }

  export type OrganizationSumOrderByAggregateInput = {
    googleExpiresIn?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type OrganizationScalarRelationFilter = {
    is?: OrganizationWhereInput
    isNot?: OrganizationWhereInput
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    organizationId?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    organizationId?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    organizationId?: SortOrder
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type PedidoCountOrderByAggregateInput = {
    id?: SortOrder
    dataPedido?: SortOrder
    dataAprovacao?: SortOrder
    cancelada?: SortOrder
    faturado?: SortOrder
    codigoPedido?: SortOrder
    codigoProduto?: SortOrder
    setor?: SortOrder
    produto?: SortOrder
    precoUnitario?: SortOrder
    quantidade?: SortOrder
    valorTotal?: SortOrder
    cliente?: SortOrder
    vendedor?: SortOrder
  }

  export type PedidoAvgOrderByAggregateInput = {
    precoUnitario?: SortOrder
    quantidade?: SortOrder
    valorTotal?: SortOrder
  }

  export type PedidoMaxOrderByAggregateInput = {
    id?: SortOrder
    dataPedido?: SortOrder
    dataAprovacao?: SortOrder
    cancelada?: SortOrder
    faturado?: SortOrder
    codigoPedido?: SortOrder
    codigoProduto?: SortOrder
    setor?: SortOrder
    produto?: SortOrder
    precoUnitario?: SortOrder
    quantidade?: SortOrder
    valorTotal?: SortOrder
    cliente?: SortOrder
    vendedor?: SortOrder
  }

  export type PedidoMinOrderByAggregateInput = {
    id?: SortOrder
    dataPedido?: SortOrder
    dataAprovacao?: SortOrder
    cancelada?: SortOrder
    faturado?: SortOrder
    codigoPedido?: SortOrder
    codigoProduto?: SortOrder
    setor?: SortOrder
    produto?: SortOrder
    precoUnitario?: SortOrder
    quantidade?: SortOrder
    valorTotal?: SortOrder
    cliente?: SortOrder
    vendedor?: SortOrder
  }

  export type PedidoSumOrderByAggregateInput = {
    precoUnitario?: SortOrder
    quantidade?: SortOrder
    valorTotal?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type AnuncioCTRListRelationFilter = {
    every?: AnuncioCTRWhereInput
    some?: AnuncioCTRWhereInput
    none?: AnuncioCTRWhereInput
  }

  export type AnuncioConversaoListRelationFilter = {
    every?: AnuncioConversaoWhereInput
    some?: AnuncioConversaoWhereInput
    none?: AnuncioConversaoWhereInput
  }

  export type CanalTrafegoListRelationFilter = {
    every?: CanalTrafegoWhereInput
    some?: CanalTrafegoWhereInput
    none?: CanalTrafegoWhereInput
  }

  export type PalavraChaveListRelationFilter = {
    every?: PalavraChaveWhereInput
    some?: PalavraChaveWhereInput
    none?: PalavraChaveWhereInput
  }

  export type TrafegoListRelationFilter = {
    every?: TrafegoWhereInput
    some?: TrafegoWhereInput
    none?: TrafegoWhereInput
  }

  export type AnuncioCTROrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AnuncioConversaoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CanalTrafegoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PalavraChaveOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TrafegoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DashboardMarketingCountOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    sessoes?: SortOrder
    usuarios?: SortOrder
    taxaRejeicao?: SortOrder
    taxaConversaoSite?: SortOrder
    taxaAbandonoCarrinho?: SortOrder
    impressoes?: SortOrder
    cliques?: SortOrder
    ctr?: SortOrder
    cpc?: SortOrder
    conversoes?: SortOrder
    custoPorConversao?: SortOrder
    roas?: SortOrder
    custoPorLead?: SortOrder
    faturamentoTotal?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DashboardMarketingAvgOrderByAggregateInput = {
    sessoes?: SortOrder
    usuarios?: SortOrder
    taxaRejeicao?: SortOrder
    taxaConversaoSite?: SortOrder
    taxaAbandonoCarrinho?: SortOrder
    impressoes?: SortOrder
    cliques?: SortOrder
    ctr?: SortOrder
    cpc?: SortOrder
    conversoes?: SortOrder
    custoPorConversao?: SortOrder
    roas?: SortOrder
    custoPorLead?: SortOrder
    faturamentoTotal?: SortOrder
  }

  export type DashboardMarketingMaxOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    sessoes?: SortOrder
    usuarios?: SortOrder
    taxaRejeicao?: SortOrder
    taxaConversaoSite?: SortOrder
    taxaAbandonoCarrinho?: SortOrder
    impressoes?: SortOrder
    cliques?: SortOrder
    ctr?: SortOrder
    cpc?: SortOrder
    conversoes?: SortOrder
    custoPorConversao?: SortOrder
    roas?: SortOrder
    custoPorLead?: SortOrder
    faturamentoTotal?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DashboardMarketingMinOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    sessoes?: SortOrder
    usuarios?: SortOrder
    taxaRejeicao?: SortOrder
    taxaConversaoSite?: SortOrder
    taxaAbandonoCarrinho?: SortOrder
    impressoes?: SortOrder
    cliques?: SortOrder
    ctr?: SortOrder
    cpc?: SortOrder
    conversoes?: SortOrder
    custoPorConversao?: SortOrder
    roas?: SortOrder
    custoPorLead?: SortOrder
    faturamentoTotal?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DashboardMarketingSumOrderByAggregateInput = {
    sessoes?: SortOrder
    usuarios?: SortOrder
    taxaRejeicao?: SortOrder
    taxaConversaoSite?: SortOrder
    taxaAbandonoCarrinho?: SortOrder
    impressoes?: SortOrder
    cliques?: SortOrder
    ctr?: SortOrder
    cpc?: SortOrder
    conversoes?: SortOrder
    custoPorConversao?: SortOrder
    roas?: SortOrder
    custoPorLead?: SortOrder
    faturamentoTotal?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type DashboardMarketingScalarRelationFilter = {
    is?: DashboardMarketingWhereInput
    isNot?: DashboardMarketingWhereInput
  }

  export type TrafegoCountOrderByAggregateInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    origem?: SortOrder
    valor?: SortOrder
  }

  export type TrafegoAvgOrderByAggregateInput = {
    valor?: SortOrder
  }

  export type TrafegoMaxOrderByAggregateInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    origem?: SortOrder
    valor?: SortOrder
  }

  export type TrafegoMinOrderByAggregateInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    origem?: SortOrder
    valor?: SortOrder
  }

  export type TrafegoSumOrderByAggregateInput = {
    valor?: SortOrder
  }

  export type CanalTrafegoCountOrderByAggregateInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    canal?: SortOrder
    taxaConversao?: SortOrder
    cpa?: SortOrder
    roi?: SortOrder
  }

  export type CanalTrafegoAvgOrderByAggregateInput = {
    taxaConversao?: SortOrder
    cpa?: SortOrder
    roi?: SortOrder
  }

  export type CanalTrafegoMaxOrderByAggregateInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    canal?: SortOrder
    taxaConversao?: SortOrder
    cpa?: SortOrder
    roi?: SortOrder
  }

  export type CanalTrafegoMinOrderByAggregateInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    canal?: SortOrder
    taxaConversao?: SortOrder
    cpa?: SortOrder
    roi?: SortOrder
  }

  export type CanalTrafegoSumOrderByAggregateInput = {
    taxaConversao?: SortOrder
    cpa?: SortOrder
    roi?: SortOrder
  }

  export type AnuncioCTRCountOrderByAggregateInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    nome?: SortOrder
    ctr?: SortOrder
  }

  export type AnuncioCTRAvgOrderByAggregateInput = {
    ctr?: SortOrder
  }

  export type AnuncioCTRMaxOrderByAggregateInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    nome?: SortOrder
    ctr?: SortOrder
  }

  export type AnuncioCTRMinOrderByAggregateInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    nome?: SortOrder
    ctr?: SortOrder
  }

  export type AnuncioCTRSumOrderByAggregateInput = {
    ctr?: SortOrder
  }

  export type AnuncioConversaoCountOrderByAggregateInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    nome?: SortOrder
    conversoes?: SortOrder
  }

  export type AnuncioConversaoAvgOrderByAggregateInput = {
    conversoes?: SortOrder
  }

  export type AnuncioConversaoMaxOrderByAggregateInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    nome?: SortOrder
    conversoes?: SortOrder
  }

  export type AnuncioConversaoMinOrderByAggregateInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    nome?: SortOrder
    conversoes?: SortOrder
  }

  export type AnuncioConversaoSumOrderByAggregateInput = {
    conversoes?: SortOrder
  }

  export type PalavraChaveCountOrderByAggregateInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    palavra?: SortOrder
    ctr?: SortOrder
  }

  export type PalavraChaveAvgOrderByAggregateInput = {
    ctr?: SortOrder
  }

  export type PalavraChaveMaxOrderByAggregateInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    palavra?: SortOrder
    ctr?: SortOrder
  }

  export type PalavraChaveMinOrderByAggregateInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    palavra?: SortOrder
    ctr?: SortOrder
  }

  export type PalavraChaveSumOrderByAggregateInput = {
    ctr?: SortOrder
  }

  export type ClientesRecorrentesVsUnicosListRelationFilter = {
    every?: ClientesRecorrentesVsUnicosWhereInput
    some?: ClientesRecorrentesVsUnicosWhereInput
    none?: ClientesRecorrentesVsUnicosWhereInput
  }

  export type ProdutoRankListRelationFilter = {
    every?: ProdutoRankWhereInput
    some?: ProdutoRankWhereInput
    none?: ProdutoRankWhereInput
  }

  export type ReceitaCategoriaListRelationFilter = {
    every?: ReceitaCategoriaWhereInput
    some?: ReceitaCategoriaWhereInput
    none?: ReceitaCategoriaWhereInput
  }

  export type ReceitaMetodoPagamentoListRelationFilter = {
    every?: ReceitaMetodoPagamentoWhereInput
    some?: ReceitaMetodoPagamentoWhereInput
    none?: ReceitaMetodoPagamentoWhereInput
  }

  export type ClientesRecorrentesVsUnicosOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProdutoRankOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ReceitaCategoriaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ReceitaMetodoPagamentoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DashboardComercialCountOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    receitaTotal?: SortOrder
    ticketMedio?: SortOrder
    crescimentoReceita?: SortOrder
    novosClientes?: SortOrder
    taxaRetencaoClientes?: SortOrder
    clv?: SortOrder
    volumeReparos?: SortOrder
    taxaReincidenciaReparos?: SortOrder
    receitaReparosVsVendas?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DashboardComercialAvgOrderByAggregateInput = {
    receitaTotal?: SortOrder
    ticketMedio?: SortOrder
    crescimentoReceita?: SortOrder
    novosClientes?: SortOrder
    taxaRetencaoClientes?: SortOrder
    clv?: SortOrder
    volumeReparos?: SortOrder
    taxaReincidenciaReparos?: SortOrder
    receitaReparosVsVendas?: SortOrder
  }

  export type DashboardComercialMaxOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    receitaTotal?: SortOrder
    ticketMedio?: SortOrder
    crescimentoReceita?: SortOrder
    novosClientes?: SortOrder
    taxaRetencaoClientes?: SortOrder
    clv?: SortOrder
    volumeReparos?: SortOrder
    taxaReincidenciaReparos?: SortOrder
    receitaReparosVsVendas?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DashboardComercialMinOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    receitaTotal?: SortOrder
    ticketMedio?: SortOrder
    crescimentoReceita?: SortOrder
    novosClientes?: SortOrder
    taxaRetencaoClientes?: SortOrder
    clv?: SortOrder
    volumeReparos?: SortOrder
    taxaReincidenciaReparos?: SortOrder
    receitaReparosVsVendas?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DashboardComercialSumOrderByAggregateInput = {
    receitaTotal?: SortOrder
    ticketMedio?: SortOrder
    crescimentoReceita?: SortOrder
    novosClientes?: SortOrder
    taxaRetencaoClientes?: SortOrder
    clv?: SortOrder
    volumeReparos?: SortOrder
    taxaReincidenciaReparos?: SortOrder
    receitaReparosVsVendas?: SortOrder
  }

  export type DashboardComercialScalarRelationFilter = {
    is?: DashboardComercialWhereInput
    isNot?: DashboardComercialWhereInput
  }

  export type ReceitaCategoriaCountOrderByAggregateInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    categoria?: SortOrder
    receita?: SortOrder
  }

  export type ReceitaCategoriaAvgOrderByAggregateInput = {
    receita?: SortOrder
  }

  export type ReceitaCategoriaMaxOrderByAggregateInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    categoria?: SortOrder
    receita?: SortOrder
  }

  export type ReceitaCategoriaMinOrderByAggregateInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    categoria?: SortOrder
    receita?: SortOrder
  }

  export type ReceitaCategoriaSumOrderByAggregateInput = {
    receita?: SortOrder
  }

  export type ReceitaMetodoPagamentoCountOrderByAggregateInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    metodoPagamento?: SortOrder
    receita?: SortOrder
  }

  export type ReceitaMetodoPagamentoAvgOrderByAggregateInput = {
    receita?: SortOrder
  }

  export type ReceitaMetodoPagamentoMaxOrderByAggregateInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    metodoPagamento?: SortOrder
    receita?: SortOrder
  }

  export type ReceitaMetodoPagamentoMinOrderByAggregateInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    metodoPagamento?: SortOrder
    receita?: SortOrder
  }

  export type ReceitaMetodoPagamentoSumOrderByAggregateInput = {
    receita?: SortOrder
  }

  export type ClientesRecorrentesVsUnicosCountOrderByAggregateInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    tipoCliente?: SortOrder
    quantidade?: SortOrder
  }

  export type ClientesRecorrentesVsUnicosAvgOrderByAggregateInput = {
    quantidade?: SortOrder
  }

  export type ClientesRecorrentesVsUnicosMaxOrderByAggregateInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    tipoCliente?: SortOrder
    quantidade?: SortOrder
  }

  export type ClientesRecorrentesVsUnicosMinOrderByAggregateInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    tipoCliente?: SortOrder
    quantidade?: SortOrder
  }

  export type ClientesRecorrentesVsUnicosSumOrderByAggregateInput = {
    quantidade?: SortOrder
  }

  export type ProdutoRankCountOrderByAggregateInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    produto?: SortOrder
    vendas?: SortOrder
  }

  export type ProdutoRankAvgOrderByAggregateInput = {
    vendas?: SortOrder
  }

  export type ProdutoRankMaxOrderByAggregateInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    produto?: SortOrder
    vendas?: SortOrder
  }

  export type ProdutoRankMinOrderByAggregateInput = {
    id?: SortOrder
    dashboardId?: SortOrder
    produto?: SortOrder
    vendas?: SortOrder
  }

  export type ProdutoRankSumOrderByAggregateInput = {
    vendas?: SortOrder
  }

  export type DashboardComercialCreateNestedOneWithoutOrganizationInput = {
    create?: XOR<DashboardComercialCreateWithoutOrganizationInput, DashboardComercialUncheckedCreateWithoutOrganizationInput>
    connectOrCreate?: DashboardComercialCreateOrConnectWithoutOrganizationInput
    connect?: DashboardComercialWhereUniqueInput
  }

  export type DashboardMarketingCreateNestedOneWithoutOrganizationInput = {
    create?: XOR<DashboardMarketingCreateWithoutOrganizationInput, DashboardMarketingUncheckedCreateWithoutOrganizationInput>
    connectOrCreate?: DashboardMarketingCreateOrConnectWithoutOrganizationInput
    connect?: DashboardMarketingWhereUniqueInput
  }

  export type UserCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<UserCreateWithoutOrganizationInput, UserUncheckedCreateWithoutOrganizationInput> | UserCreateWithoutOrganizationInput[] | UserUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: UserCreateOrConnectWithoutOrganizationInput | UserCreateOrConnectWithoutOrganizationInput[]
    createMany?: UserCreateManyOrganizationInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type DashboardComercialUncheckedCreateNestedOneWithoutOrganizationInput = {
    create?: XOR<DashboardComercialCreateWithoutOrganizationInput, DashboardComercialUncheckedCreateWithoutOrganizationInput>
    connectOrCreate?: DashboardComercialCreateOrConnectWithoutOrganizationInput
    connect?: DashboardComercialWhereUniqueInput
  }

  export type DashboardMarketingUncheckedCreateNestedOneWithoutOrganizationInput = {
    create?: XOR<DashboardMarketingCreateWithoutOrganizationInput, DashboardMarketingUncheckedCreateWithoutOrganizationInput>
    connectOrCreate?: DashboardMarketingCreateOrConnectWithoutOrganizationInput
    connect?: DashboardMarketingWhereUniqueInput
  }

  export type UserUncheckedCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<UserCreateWithoutOrganizationInput, UserUncheckedCreateWithoutOrganizationInput> | UserCreateWithoutOrganizationInput[] | UserUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: UserCreateOrConnectWithoutOrganizationInput | UserCreateOrConnectWithoutOrganizationInput[]
    createMany?: UserCreateManyOrganizationInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DashboardComercialUpdateOneWithoutOrganizationNestedInput = {
    create?: XOR<DashboardComercialCreateWithoutOrganizationInput, DashboardComercialUncheckedCreateWithoutOrganizationInput>
    connectOrCreate?: DashboardComercialCreateOrConnectWithoutOrganizationInput
    upsert?: DashboardComercialUpsertWithoutOrganizationInput
    disconnect?: DashboardComercialWhereInput | boolean
    delete?: DashboardComercialWhereInput | boolean
    connect?: DashboardComercialWhereUniqueInput
    update?: XOR<XOR<DashboardComercialUpdateToOneWithWhereWithoutOrganizationInput, DashboardComercialUpdateWithoutOrganizationInput>, DashboardComercialUncheckedUpdateWithoutOrganizationInput>
  }

  export type DashboardMarketingUpdateOneWithoutOrganizationNestedInput = {
    create?: XOR<DashboardMarketingCreateWithoutOrganizationInput, DashboardMarketingUncheckedCreateWithoutOrganizationInput>
    connectOrCreate?: DashboardMarketingCreateOrConnectWithoutOrganizationInput
    upsert?: DashboardMarketingUpsertWithoutOrganizationInput
    disconnect?: DashboardMarketingWhereInput | boolean
    delete?: DashboardMarketingWhereInput | boolean
    connect?: DashboardMarketingWhereUniqueInput
    update?: XOR<XOR<DashboardMarketingUpdateToOneWithWhereWithoutOrganizationInput, DashboardMarketingUpdateWithoutOrganizationInput>, DashboardMarketingUncheckedUpdateWithoutOrganizationInput>
  }

  export type UserUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<UserCreateWithoutOrganizationInput, UserUncheckedCreateWithoutOrganizationInput> | UserCreateWithoutOrganizationInput[] | UserUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: UserCreateOrConnectWithoutOrganizationInput | UserCreateOrConnectWithoutOrganizationInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutOrganizationInput | UserUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: UserCreateManyOrganizationInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutOrganizationInput | UserUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: UserUpdateManyWithWhereWithoutOrganizationInput | UserUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type DashboardComercialUncheckedUpdateOneWithoutOrganizationNestedInput = {
    create?: XOR<DashboardComercialCreateWithoutOrganizationInput, DashboardComercialUncheckedCreateWithoutOrganizationInput>
    connectOrCreate?: DashboardComercialCreateOrConnectWithoutOrganizationInput
    upsert?: DashboardComercialUpsertWithoutOrganizationInput
    disconnect?: DashboardComercialWhereInput | boolean
    delete?: DashboardComercialWhereInput | boolean
    connect?: DashboardComercialWhereUniqueInput
    update?: XOR<XOR<DashboardComercialUpdateToOneWithWhereWithoutOrganizationInput, DashboardComercialUpdateWithoutOrganizationInput>, DashboardComercialUncheckedUpdateWithoutOrganizationInput>
  }

  export type DashboardMarketingUncheckedUpdateOneWithoutOrganizationNestedInput = {
    create?: XOR<DashboardMarketingCreateWithoutOrganizationInput, DashboardMarketingUncheckedCreateWithoutOrganizationInput>
    connectOrCreate?: DashboardMarketingCreateOrConnectWithoutOrganizationInput
    upsert?: DashboardMarketingUpsertWithoutOrganizationInput
    disconnect?: DashboardMarketingWhereInput | boolean
    delete?: DashboardMarketingWhereInput | boolean
    connect?: DashboardMarketingWhereUniqueInput
    update?: XOR<XOR<DashboardMarketingUpdateToOneWithWhereWithoutOrganizationInput, DashboardMarketingUpdateWithoutOrganizationInput>, DashboardMarketingUncheckedUpdateWithoutOrganizationInput>
  }

  export type UserUncheckedUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<UserCreateWithoutOrganizationInput, UserUncheckedCreateWithoutOrganizationInput> | UserCreateWithoutOrganizationInput[] | UserUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: UserCreateOrConnectWithoutOrganizationInput | UserCreateOrConnectWithoutOrganizationInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutOrganizationInput | UserUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: UserCreateManyOrganizationInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutOrganizationInput | UserUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: UserUpdateManyWithWhereWithoutOrganizationInput | UserUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type OrganizationCreateNestedOneWithoutUsersInput = {
    create?: XOR<OrganizationCreateWithoutUsersInput, OrganizationUncheckedCreateWithoutUsersInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutUsersInput
    connect?: OrganizationWhereUniqueInput
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type OrganizationUpdateOneRequiredWithoutUsersNestedInput = {
    create?: XOR<OrganizationCreateWithoutUsersInput, OrganizationUncheckedCreateWithoutUsersInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutUsersInput
    upsert?: OrganizationUpsertWithoutUsersInput
    connect?: OrganizationWhereUniqueInput
    update?: XOR<XOR<OrganizationUpdateToOneWithWhereWithoutUsersInput, OrganizationUpdateWithoutUsersInput>, OrganizationUncheckedUpdateWithoutUsersInput>
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type AnuncioCTRCreateNestedManyWithoutDashboardInput = {
    create?: XOR<AnuncioCTRCreateWithoutDashboardInput, AnuncioCTRUncheckedCreateWithoutDashboardInput> | AnuncioCTRCreateWithoutDashboardInput[] | AnuncioCTRUncheckedCreateWithoutDashboardInput[]
    connectOrCreate?: AnuncioCTRCreateOrConnectWithoutDashboardInput | AnuncioCTRCreateOrConnectWithoutDashboardInput[]
    createMany?: AnuncioCTRCreateManyDashboardInputEnvelope
    connect?: AnuncioCTRWhereUniqueInput | AnuncioCTRWhereUniqueInput[]
  }

  export type AnuncioConversaoCreateNestedManyWithoutDashboardInput = {
    create?: XOR<AnuncioConversaoCreateWithoutDashboardInput, AnuncioConversaoUncheckedCreateWithoutDashboardInput> | AnuncioConversaoCreateWithoutDashboardInput[] | AnuncioConversaoUncheckedCreateWithoutDashboardInput[]
    connectOrCreate?: AnuncioConversaoCreateOrConnectWithoutDashboardInput | AnuncioConversaoCreateOrConnectWithoutDashboardInput[]
    createMany?: AnuncioConversaoCreateManyDashboardInputEnvelope
    connect?: AnuncioConversaoWhereUniqueInput | AnuncioConversaoWhereUniqueInput[]
  }

  export type CanalTrafegoCreateNestedManyWithoutDashboardInput = {
    create?: XOR<CanalTrafegoCreateWithoutDashboardInput, CanalTrafegoUncheckedCreateWithoutDashboardInput> | CanalTrafegoCreateWithoutDashboardInput[] | CanalTrafegoUncheckedCreateWithoutDashboardInput[]
    connectOrCreate?: CanalTrafegoCreateOrConnectWithoutDashboardInput | CanalTrafegoCreateOrConnectWithoutDashboardInput[]
    createMany?: CanalTrafegoCreateManyDashboardInputEnvelope
    connect?: CanalTrafegoWhereUniqueInput | CanalTrafegoWhereUniqueInput[]
  }

  export type OrganizationCreateNestedOneWithoutDashboardMarketingInput = {
    create?: XOR<OrganizationCreateWithoutDashboardMarketingInput, OrganizationUncheckedCreateWithoutDashboardMarketingInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutDashboardMarketingInput
    connect?: OrganizationWhereUniqueInput
  }

  export type PalavraChaveCreateNestedManyWithoutDashboardInput = {
    create?: XOR<PalavraChaveCreateWithoutDashboardInput, PalavraChaveUncheckedCreateWithoutDashboardInput> | PalavraChaveCreateWithoutDashboardInput[] | PalavraChaveUncheckedCreateWithoutDashboardInput[]
    connectOrCreate?: PalavraChaveCreateOrConnectWithoutDashboardInput | PalavraChaveCreateOrConnectWithoutDashboardInput[]
    createMany?: PalavraChaveCreateManyDashboardInputEnvelope
    connect?: PalavraChaveWhereUniqueInput | PalavraChaveWhereUniqueInput[]
  }

  export type TrafegoCreateNestedManyWithoutDashboardInput = {
    create?: XOR<TrafegoCreateWithoutDashboardInput, TrafegoUncheckedCreateWithoutDashboardInput> | TrafegoCreateWithoutDashboardInput[] | TrafegoUncheckedCreateWithoutDashboardInput[]
    connectOrCreate?: TrafegoCreateOrConnectWithoutDashboardInput | TrafegoCreateOrConnectWithoutDashboardInput[]
    createMany?: TrafegoCreateManyDashboardInputEnvelope
    connect?: TrafegoWhereUniqueInput | TrafegoWhereUniqueInput[]
  }

  export type AnuncioCTRUncheckedCreateNestedManyWithoutDashboardInput = {
    create?: XOR<AnuncioCTRCreateWithoutDashboardInput, AnuncioCTRUncheckedCreateWithoutDashboardInput> | AnuncioCTRCreateWithoutDashboardInput[] | AnuncioCTRUncheckedCreateWithoutDashboardInput[]
    connectOrCreate?: AnuncioCTRCreateOrConnectWithoutDashboardInput | AnuncioCTRCreateOrConnectWithoutDashboardInput[]
    createMany?: AnuncioCTRCreateManyDashboardInputEnvelope
    connect?: AnuncioCTRWhereUniqueInput | AnuncioCTRWhereUniqueInput[]
  }

  export type AnuncioConversaoUncheckedCreateNestedManyWithoutDashboardInput = {
    create?: XOR<AnuncioConversaoCreateWithoutDashboardInput, AnuncioConversaoUncheckedCreateWithoutDashboardInput> | AnuncioConversaoCreateWithoutDashboardInput[] | AnuncioConversaoUncheckedCreateWithoutDashboardInput[]
    connectOrCreate?: AnuncioConversaoCreateOrConnectWithoutDashboardInput | AnuncioConversaoCreateOrConnectWithoutDashboardInput[]
    createMany?: AnuncioConversaoCreateManyDashboardInputEnvelope
    connect?: AnuncioConversaoWhereUniqueInput | AnuncioConversaoWhereUniqueInput[]
  }

  export type CanalTrafegoUncheckedCreateNestedManyWithoutDashboardInput = {
    create?: XOR<CanalTrafegoCreateWithoutDashboardInput, CanalTrafegoUncheckedCreateWithoutDashboardInput> | CanalTrafegoCreateWithoutDashboardInput[] | CanalTrafegoUncheckedCreateWithoutDashboardInput[]
    connectOrCreate?: CanalTrafegoCreateOrConnectWithoutDashboardInput | CanalTrafegoCreateOrConnectWithoutDashboardInput[]
    createMany?: CanalTrafegoCreateManyDashboardInputEnvelope
    connect?: CanalTrafegoWhereUniqueInput | CanalTrafegoWhereUniqueInput[]
  }

  export type PalavraChaveUncheckedCreateNestedManyWithoutDashboardInput = {
    create?: XOR<PalavraChaveCreateWithoutDashboardInput, PalavraChaveUncheckedCreateWithoutDashboardInput> | PalavraChaveCreateWithoutDashboardInput[] | PalavraChaveUncheckedCreateWithoutDashboardInput[]
    connectOrCreate?: PalavraChaveCreateOrConnectWithoutDashboardInput | PalavraChaveCreateOrConnectWithoutDashboardInput[]
    createMany?: PalavraChaveCreateManyDashboardInputEnvelope
    connect?: PalavraChaveWhereUniqueInput | PalavraChaveWhereUniqueInput[]
  }

  export type TrafegoUncheckedCreateNestedManyWithoutDashboardInput = {
    create?: XOR<TrafegoCreateWithoutDashboardInput, TrafegoUncheckedCreateWithoutDashboardInput> | TrafegoCreateWithoutDashboardInput[] | TrafegoUncheckedCreateWithoutDashboardInput[]
    connectOrCreate?: TrafegoCreateOrConnectWithoutDashboardInput | TrafegoCreateOrConnectWithoutDashboardInput[]
    createMany?: TrafegoCreateManyDashboardInputEnvelope
    connect?: TrafegoWhereUniqueInput | TrafegoWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type AnuncioCTRUpdateManyWithoutDashboardNestedInput = {
    create?: XOR<AnuncioCTRCreateWithoutDashboardInput, AnuncioCTRUncheckedCreateWithoutDashboardInput> | AnuncioCTRCreateWithoutDashboardInput[] | AnuncioCTRUncheckedCreateWithoutDashboardInput[]
    connectOrCreate?: AnuncioCTRCreateOrConnectWithoutDashboardInput | AnuncioCTRCreateOrConnectWithoutDashboardInput[]
    upsert?: AnuncioCTRUpsertWithWhereUniqueWithoutDashboardInput | AnuncioCTRUpsertWithWhereUniqueWithoutDashboardInput[]
    createMany?: AnuncioCTRCreateManyDashboardInputEnvelope
    set?: AnuncioCTRWhereUniqueInput | AnuncioCTRWhereUniqueInput[]
    disconnect?: AnuncioCTRWhereUniqueInput | AnuncioCTRWhereUniqueInput[]
    delete?: AnuncioCTRWhereUniqueInput | AnuncioCTRWhereUniqueInput[]
    connect?: AnuncioCTRWhereUniqueInput | AnuncioCTRWhereUniqueInput[]
    update?: AnuncioCTRUpdateWithWhereUniqueWithoutDashboardInput | AnuncioCTRUpdateWithWhereUniqueWithoutDashboardInput[]
    updateMany?: AnuncioCTRUpdateManyWithWhereWithoutDashboardInput | AnuncioCTRUpdateManyWithWhereWithoutDashboardInput[]
    deleteMany?: AnuncioCTRScalarWhereInput | AnuncioCTRScalarWhereInput[]
  }

  export type AnuncioConversaoUpdateManyWithoutDashboardNestedInput = {
    create?: XOR<AnuncioConversaoCreateWithoutDashboardInput, AnuncioConversaoUncheckedCreateWithoutDashboardInput> | AnuncioConversaoCreateWithoutDashboardInput[] | AnuncioConversaoUncheckedCreateWithoutDashboardInput[]
    connectOrCreate?: AnuncioConversaoCreateOrConnectWithoutDashboardInput | AnuncioConversaoCreateOrConnectWithoutDashboardInput[]
    upsert?: AnuncioConversaoUpsertWithWhereUniqueWithoutDashboardInput | AnuncioConversaoUpsertWithWhereUniqueWithoutDashboardInput[]
    createMany?: AnuncioConversaoCreateManyDashboardInputEnvelope
    set?: AnuncioConversaoWhereUniqueInput | AnuncioConversaoWhereUniqueInput[]
    disconnect?: AnuncioConversaoWhereUniqueInput | AnuncioConversaoWhereUniqueInput[]
    delete?: AnuncioConversaoWhereUniqueInput | AnuncioConversaoWhereUniqueInput[]
    connect?: AnuncioConversaoWhereUniqueInput | AnuncioConversaoWhereUniqueInput[]
    update?: AnuncioConversaoUpdateWithWhereUniqueWithoutDashboardInput | AnuncioConversaoUpdateWithWhereUniqueWithoutDashboardInput[]
    updateMany?: AnuncioConversaoUpdateManyWithWhereWithoutDashboardInput | AnuncioConversaoUpdateManyWithWhereWithoutDashboardInput[]
    deleteMany?: AnuncioConversaoScalarWhereInput | AnuncioConversaoScalarWhereInput[]
  }

  export type CanalTrafegoUpdateManyWithoutDashboardNestedInput = {
    create?: XOR<CanalTrafegoCreateWithoutDashboardInput, CanalTrafegoUncheckedCreateWithoutDashboardInput> | CanalTrafegoCreateWithoutDashboardInput[] | CanalTrafegoUncheckedCreateWithoutDashboardInput[]
    connectOrCreate?: CanalTrafegoCreateOrConnectWithoutDashboardInput | CanalTrafegoCreateOrConnectWithoutDashboardInput[]
    upsert?: CanalTrafegoUpsertWithWhereUniqueWithoutDashboardInput | CanalTrafegoUpsertWithWhereUniqueWithoutDashboardInput[]
    createMany?: CanalTrafegoCreateManyDashboardInputEnvelope
    set?: CanalTrafegoWhereUniqueInput | CanalTrafegoWhereUniqueInput[]
    disconnect?: CanalTrafegoWhereUniqueInput | CanalTrafegoWhereUniqueInput[]
    delete?: CanalTrafegoWhereUniqueInput | CanalTrafegoWhereUniqueInput[]
    connect?: CanalTrafegoWhereUniqueInput | CanalTrafegoWhereUniqueInput[]
    update?: CanalTrafegoUpdateWithWhereUniqueWithoutDashboardInput | CanalTrafegoUpdateWithWhereUniqueWithoutDashboardInput[]
    updateMany?: CanalTrafegoUpdateManyWithWhereWithoutDashboardInput | CanalTrafegoUpdateManyWithWhereWithoutDashboardInput[]
    deleteMany?: CanalTrafegoScalarWhereInput | CanalTrafegoScalarWhereInput[]
  }

  export type OrganizationUpdateOneRequiredWithoutDashboardMarketingNestedInput = {
    create?: XOR<OrganizationCreateWithoutDashboardMarketingInput, OrganizationUncheckedCreateWithoutDashboardMarketingInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutDashboardMarketingInput
    upsert?: OrganizationUpsertWithoutDashboardMarketingInput
    connect?: OrganizationWhereUniqueInput
    update?: XOR<XOR<OrganizationUpdateToOneWithWhereWithoutDashboardMarketingInput, OrganizationUpdateWithoutDashboardMarketingInput>, OrganizationUncheckedUpdateWithoutDashboardMarketingInput>
  }

  export type PalavraChaveUpdateManyWithoutDashboardNestedInput = {
    create?: XOR<PalavraChaveCreateWithoutDashboardInput, PalavraChaveUncheckedCreateWithoutDashboardInput> | PalavraChaveCreateWithoutDashboardInput[] | PalavraChaveUncheckedCreateWithoutDashboardInput[]
    connectOrCreate?: PalavraChaveCreateOrConnectWithoutDashboardInput | PalavraChaveCreateOrConnectWithoutDashboardInput[]
    upsert?: PalavraChaveUpsertWithWhereUniqueWithoutDashboardInput | PalavraChaveUpsertWithWhereUniqueWithoutDashboardInput[]
    createMany?: PalavraChaveCreateManyDashboardInputEnvelope
    set?: PalavraChaveWhereUniqueInput | PalavraChaveWhereUniqueInput[]
    disconnect?: PalavraChaveWhereUniqueInput | PalavraChaveWhereUniqueInput[]
    delete?: PalavraChaveWhereUniqueInput | PalavraChaveWhereUniqueInput[]
    connect?: PalavraChaveWhereUniqueInput | PalavraChaveWhereUniqueInput[]
    update?: PalavraChaveUpdateWithWhereUniqueWithoutDashboardInput | PalavraChaveUpdateWithWhereUniqueWithoutDashboardInput[]
    updateMany?: PalavraChaveUpdateManyWithWhereWithoutDashboardInput | PalavraChaveUpdateManyWithWhereWithoutDashboardInput[]
    deleteMany?: PalavraChaveScalarWhereInput | PalavraChaveScalarWhereInput[]
  }

  export type TrafegoUpdateManyWithoutDashboardNestedInput = {
    create?: XOR<TrafegoCreateWithoutDashboardInput, TrafegoUncheckedCreateWithoutDashboardInput> | TrafegoCreateWithoutDashboardInput[] | TrafegoUncheckedCreateWithoutDashboardInput[]
    connectOrCreate?: TrafegoCreateOrConnectWithoutDashboardInput | TrafegoCreateOrConnectWithoutDashboardInput[]
    upsert?: TrafegoUpsertWithWhereUniqueWithoutDashboardInput | TrafegoUpsertWithWhereUniqueWithoutDashboardInput[]
    createMany?: TrafegoCreateManyDashboardInputEnvelope
    set?: TrafegoWhereUniqueInput | TrafegoWhereUniqueInput[]
    disconnect?: TrafegoWhereUniqueInput | TrafegoWhereUniqueInput[]
    delete?: TrafegoWhereUniqueInput | TrafegoWhereUniqueInput[]
    connect?: TrafegoWhereUniqueInput | TrafegoWhereUniqueInput[]
    update?: TrafegoUpdateWithWhereUniqueWithoutDashboardInput | TrafegoUpdateWithWhereUniqueWithoutDashboardInput[]
    updateMany?: TrafegoUpdateManyWithWhereWithoutDashboardInput | TrafegoUpdateManyWithWhereWithoutDashboardInput[]
    deleteMany?: TrafegoScalarWhereInput | TrafegoScalarWhereInput[]
  }

  export type AnuncioCTRUncheckedUpdateManyWithoutDashboardNestedInput = {
    create?: XOR<AnuncioCTRCreateWithoutDashboardInput, AnuncioCTRUncheckedCreateWithoutDashboardInput> | AnuncioCTRCreateWithoutDashboardInput[] | AnuncioCTRUncheckedCreateWithoutDashboardInput[]
    connectOrCreate?: AnuncioCTRCreateOrConnectWithoutDashboardInput | AnuncioCTRCreateOrConnectWithoutDashboardInput[]
    upsert?: AnuncioCTRUpsertWithWhereUniqueWithoutDashboardInput | AnuncioCTRUpsertWithWhereUniqueWithoutDashboardInput[]
    createMany?: AnuncioCTRCreateManyDashboardInputEnvelope
    set?: AnuncioCTRWhereUniqueInput | AnuncioCTRWhereUniqueInput[]
    disconnect?: AnuncioCTRWhereUniqueInput | AnuncioCTRWhereUniqueInput[]
    delete?: AnuncioCTRWhereUniqueInput | AnuncioCTRWhereUniqueInput[]
    connect?: AnuncioCTRWhereUniqueInput | AnuncioCTRWhereUniqueInput[]
    update?: AnuncioCTRUpdateWithWhereUniqueWithoutDashboardInput | AnuncioCTRUpdateWithWhereUniqueWithoutDashboardInput[]
    updateMany?: AnuncioCTRUpdateManyWithWhereWithoutDashboardInput | AnuncioCTRUpdateManyWithWhereWithoutDashboardInput[]
    deleteMany?: AnuncioCTRScalarWhereInput | AnuncioCTRScalarWhereInput[]
  }

  export type AnuncioConversaoUncheckedUpdateManyWithoutDashboardNestedInput = {
    create?: XOR<AnuncioConversaoCreateWithoutDashboardInput, AnuncioConversaoUncheckedCreateWithoutDashboardInput> | AnuncioConversaoCreateWithoutDashboardInput[] | AnuncioConversaoUncheckedCreateWithoutDashboardInput[]
    connectOrCreate?: AnuncioConversaoCreateOrConnectWithoutDashboardInput | AnuncioConversaoCreateOrConnectWithoutDashboardInput[]
    upsert?: AnuncioConversaoUpsertWithWhereUniqueWithoutDashboardInput | AnuncioConversaoUpsertWithWhereUniqueWithoutDashboardInput[]
    createMany?: AnuncioConversaoCreateManyDashboardInputEnvelope
    set?: AnuncioConversaoWhereUniqueInput | AnuncioConversaoWhereUniqueInput[]
    disconnect?: AnuncioConversaoWhereUniqueInput | AnuncioConversaoWhereUniqueInput[]
    delete?: AnuncioConversaoWhereUniqueInput | AnuncioConversaoWhereUniqueInput[]
    connect?: AnuncioConversaoWhereUniqueInput | AnuncioConversaoWhereUniqueInput[]
    update?: AnuncioConversaoUpdateWithWhereUniqueWithoutDashboardInput | AnuncioConversaoUpdateWithWhereUniqueWithoutDashboardInput[]
    updateMany?: AnuncioConversaoUpdateManyWithWhereWithoutDashboardInput | AnuncioConversaoUpdateManyWithWhereWithoutDashboardInput[]
    deleteMany?: AnuncioConversaoScalarWhereInput | AnuncioConversaoScalarWhereInput[]
  }

  export type CanalTrafegoUncheckedUpdateManyWithoutDashboardNestedInput = {
    create?: XOR<CanalTrafegoCreateWithoutDashboardInput, CanalTrafegoUncheckedCreateWithoutDashboardInput> | CanalTrafegoCreateWithoutDashboardInput[] | CanalTrafegoUncheckedCreateWithoutDashboardInput[]
    connectOrCreate?: CanalTrafegoCreateOrConnectWithoutDashboardInput | CanalTrafegoCreateOrConnectWithoutDashboardInput[]
    upsert?: CanalTrafegoUpsertWithWhereUniqueWithoutDashboardInput | CanalTrafegoUpsertWithWhereUniqueWithoutDashboardInput[]
    createMany?: CanalTrafegoCreateManyDashboardInputEnvelope
    set?: CanalTrafegoWhereUniqueInput | CanalTrafegoWhereUniqueInput[]
    disconnect?: CanalTrafegoWhereUniqueInput | CanalTrafegoWhereUniqueInput[]
    delete?: CanalTrafegoWhereUniqueInput | CanalTrafegoWhereUniqueInput[]
    connect?: CanalTrafegoWhereUniqueInput | CanalTrafegoWhereUniqueInput[]
    update?: CanalTrafegoUpdateWithWhereUniqueWithoutDashboardInput | CanalTrafegoUpdateWithWhereUniqueWithoutDashboardInput[]
    updateMany?: CanalTrafegoUpdateManyWithWhereWithoutDashboardInput | CanalTrafegoUpdateManyWithWhereWithoutDashboardInput[]
    deleteMany?: CanalTrafegoScalarWhereInput | CanalTrafegoScalarWhereInput[]
  }

  export type PalavraChaveUncheckedUpdateManyWithoutDashboardNestedInput = {
    create?: XOR<PalavraChaveCreateWithoutDashboardInput, PalavraChaveUncheckedCreateWithoutDashboardInput> | PalavraChaveCreateWithoutDashboardInput[] | PalavraChaveUncheckedCreateWithoutDashboardInput[]
    connectOrCreate?: PalavraChaveCreateOrConnectWithoutDashboardInput | PalavraChaveCreateOrConnectWithoutDashboardInput[]
    upsert?: PalavraChaveUpsertWithWhereUniqueWithoutDashboardInput | PalavraChaveUpsertWithWhereUniqueWithoutDashboardInput[]
    createMany?: PalavraChaveCreateManyDashboardInputEnvelope
    set?: PalavraChaveWhereUniqueInput | PalavraChaveWhereUniqueInput[]
    disconnect?: PalavraChaveWhereUniqueInput | PalavraChaveWhereUniqueInput[]
    delete?: PalavraChaveWhereUniqueInput | PalavraChaveWhereUniqueInput[]
    connect?: PalavraChaveWhereUniqueInput | PalavraChaveWhereUniqueInput[]
    update?: PalavraChaveUpdateWithWhereUniqueWithoutDashboardInput | PalavraChaveUpdateWithWhereUniqueWithoutDashboardInput[]
    updateMany?: PalavraChaveUpdateManyWithWhereWithoutDashboardInput | PalavraChaveUpdateManyWithWhereWithoutDashboardInput[]
    deleteMany?: PalavraChaveScalarWhereInput | PalavraChaveScalarWhereInput[]
  }

  export type TrafegoUncheckedUpdateManyWithoutDashboardNestedInput = {
    create?: XOR<TrafegoCreateWithoutDashboardInput, TrafegoUncheckedCreateWithoutDashboardInput> | TrafegoCreateWithoutDashboardInput[] | TrafegoUncheckedCreateWithoutDashboardInput[]
    connectOrCreate?: TrafegoCreateOrConnectWithoutDashboardInput | TrafegoCreateOrConnectWithoutDashboardInput[]
    upsert?: TrafegoUpsertWithWhereUniqueWithoutDashboardInput | TrafegoUpsertWithWhereUniqueWithoutDashboardInput[]
    createMany?: TrafegoCreateManyDashboardInputEnvelope
    set?: TrafegoWhereUniqueInput | TrafegoWhereUniqueInput[]
    disconnect?: TrafegoWhereUniqueInput | TrafegoWhereUniqueInput[]
    delete?: TrafegoWhereUniqueInput | TrafegoWhereUniqueInput[]
    connect?: TrafegoWhereUniqueInput | TrafegoWhereUniqueInput[]
    update?: TrafegoUpdateWithWhereUniqueWithoutDashboardInput | TrafegoUpdateWithWhereUniqueWithoutDashboardInput[]
    updateMany?: TrafegoUpdateManyWithWhereWithoutDashboardInput | TrafegoUpdateManyWithWhereWithoutDashboardInput[]
    deleteMany?: TrafegoScalarWhereInput | TrafegoScalarWhereInput[]
  }

  export type DashboardMarketingCreateNestedOneWithoutTrafegoInput = {
    create?: XOR<DashboardMarketingCreateWithoutTrafegoInput, DashboardMarketingUncheckedCreateWithoutTrafegoInput>
    connectOrCreate?: DashboardMarketingCreateOrConnectWithoutTrafegoInput
    connect?: DashboardMarketingWhereUniqueInput
  }

  export type DashboardMarketingUpdateOneRequiredWithoutTrafegoNestedInput = {
    create?: XOR<DashboardMarketingCreateWithoutTrafegoInput, DashboardMarketingUncheckedCreateWithoutTrafegoInput>
    connectOrCreate?: DashboardMarketingCreateOrConnectWithoutTrafegoInput
    upsert?: DashboardMarketingUpsertWithoutTrafegoInput
    connect?: DashboardMarketingWhereUniqueInput
    update?: XOR<XOR<DashboardMarketingUpdateToOneWithWhereWithoutTrafegoInput, DashboardMarketingUpdateWithoutTrafegoInput>, DashboardMarketingUncheckedUpdateWithoutTrafegoInput>
  }

  export type DashboardMarketingCreateNestedOneWithoutCanaisInput = {
    create?: XOR<DashboardMarketingCreateWithoutCanaisInput, DashboardMarketingUncheckedCreateWithoutCanaisInput>
    connectOrCreate?: DashboardMarketingCreateOrConnectWithoutCanaisInput
    connect?: DashboardMarketingWhereUniqueInput
  }

  export type DashboardMarketingUpdateOneRequiredWithoutCanaisNestedInput = {
    create?: XOR<DashboardMarketingCreateWithoutCanaisInput, DashboardMarketingUncheckedCreateWithoutCanaisInput>
    connectOrCreate?: DashboardMarketingCreateOrConnectWithoutCanaisInput
    upsert?: DashboardMarketingUpsertWithoutCanaisInput
    connect?: DashboardMarketingWhereUniqueInput
    update?: XOR<XOR<DashboardMarketingUpdateToOneWithWhereWithoutCanaisInput, DashboardMarketingUpdateWithoutCanaisInput>, DashboardMarketingUncheckedUpdateWithoutCanaisInput>
  }

  export type DashboardMarketingCreateNestedOneWithoutAnunciosCTRInput = {
    create?: XOR<DashboardMarketingCreateWithoutAnunciosCTRInput, DashboardMarketingUncheckedCreateWithoutAnunciosCTRInput>
    connectOrCreate?: DashboardMarketingCreateOrConnectWithoutAnunciosCTRInput
    connect?: DashboardMarketingWhereUniqueInput
  }

  export type DashboardMarketingUpdateOneRequiredWithoutAnunciosCTRNestedInput = {
    create?: XOR<DashboardMarketingCreateWithoutAnunciosCTRInput, DashboardMarketingUncheckedCreateWithoutAnunciosCTRInput>
    connectOrCreate?: DashboardMarketingCreateOrConnectWithoutAnunciosCTRInput
    upsert?: DashboardMarketingUpsertWithoutAnunciosCTRInput
    connect?: DashboardMarketingWhereUniqueInput
    update?: XOR<XOR<DashboardMarketingUpdateToOneWithWhereWithoutAnunciosCTRInput, DashboardMarketingUpdateWithoutAnunciosCTRInput>, DashboardMarketingUncheckedUpdateWithoutAnunciosCTRInput>
  }

  export type DashboardMarketingCreateNestedOneWithoutAnunciosConvInput = {
    create?: XOR<DashboardMarketingCreateWithoutAnunciosConvInput, DashboardMarketingUncheckedCreateWithoutAnunciosConvInput>
    connectOrCreate?: DashboardMarketingCreateOrConnectWithoutAnunciosConvInput
    connect?: DashboardMarketingWhereUniqueInput
  }

  export type DashboardMarketingUpdateOneRequiredWithoutAnunciosConvNestedInput = {
    create?: XOR<DashboardMarketingCreateWithoutAnunciosConvInput, DashboardMarketingUncheckedCreateWithoutAnunciosConvInput>
    connectOrCreate?: DashboardMarketingCreateOrConnectWithoutAnunciosConvInput
    upsert?: DashboardMarketingUpsertWithoutAnunciosConvInput
    connect?: DashboardMarketingWhereUniqueInput
    update?: XOR<XOR<DashboardMarketingUpdateToOneWithWhereWithoutAnunciosConvInput, DashboardMarketingUpdateWithoutAnunciosConvInput>, DashboardMarketingUncheckedUpdateWithoutAnunciosConvInput>
  }

  export type DashboardMarketingCreateNestedOneWithoutPalavrasChaveInput = {
    create?: XOR<DashboardMarketingCreateWithoutPalavrasChaveInput, DashboardMarketingUncheckedCreateWithoutPalavrasChaveInput>
    connectOrCreate?: DashboardMarketingCreateOrConnectWithoutPalavrasChaveInput
    connect?: DashboardMarketingWhereUniqueInput
  }

  export type DashboardMarketingUpdateOneRequiredWithoutPalavrasChaveNestedInput = {
    create?: XOR<DashboardMarketingCreateWithoutPalavrasChaveInput, DashboardMarketingUncheckedCreateWithoutPalavrasChaveInput>
    connectOrCreate?: DashboardMarketingCreateOrConnectWithoutPalavrasChaveInput
    upsert?: DashboardMarketingUpsertWithoutPalavrasChaveInput
    connect?: DashboardMarketingWhereUniqueInput
    update?: XOR<XOR<DashboardMarketingUpdateToOneWithWhereWithoutPalavrasChaveInput, DashboardMarketingUpdateWithoutPalavrasChaveInput>, DashboardMarketingUncheckedUpdateWithoutPalavrasChaveInput>
  }

  export type ClientesRecorrentesVsUnicosCreateNestedManyWithoutDashboardInput = {
    create?: XOR<ClientesRecorrentesVsUnicosCreateWithoutDashboardInput, ClientesRecorrentesVsUnicosUncheckedCreateWithoutDashboardInput> | ClientesRecorrentesVsUnicosCreateWithoutDashboardInput[] | ClientesRecorrentesVsUnicosUncheckedCreateWithoutDashboardInput[]
    connectOrCreate?: ClientesRecorrentesVsUnicosCreateOrConnectWithoutDashboardInput | ClientesRecorrentesVsUnicosCreateOrConnectWithoutDashboardInput[]
    createMany?: ClientesRecorrentesVsUnicosCreateManyDashboardInputEnvelope
    connect?: ClientesRecorrentesVsUnicosWhereUniqueInput | ClientesRecorrentesVsUnicosWhereUniqueInput[]
  }

  export type OrganizationCreateNestedOneWithoutDashboardComercialInput = {
    create?: XOR<OrganizationCreateWithoutDashboardComercialInput, OrganizationUncheckedCreateWithoutDashboardComercialInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutDashboardComercialInput
    connect?: OrganizationWhereUniqueInput
  }

  export type ProdutoRankCreateNestedManyWithoutDashboardInput = {
    create?: XOR<ProdutoRankCreateWithoutDashboardInput, ProdutoRankUncheckedCreateWithoutDashboardInput> | ProdutoRankCreateWithoutDashboardInput[] | ProdutoRankUncheckedCreateWithoutDashboardInput[]
    connectOrCreate?: ProdutoRankCreateOrConnectWithoutDashboardInput | ProdutoRankCreateOrConnectWithoutDashboardInput[]
    createMany?: ProdutoRankCreateManyDashboardInputEnvelope
    connect?: ProdutoRankWhereUniqueInput | ProdutoRankWhereUniqueInput[]
  }

  export type ReceitaCategoriaCreateNestedManyWithoutDashboardInput = {
    create?: XOR<ReceitaCategoriaCreateWithoutDashboardInput, ReceitaCategoriaUncheckedCreateWithoutDashboardInput> | ReceitaCategoriaCreateWithoutDashboardInput[] | ReceitaCategoriaUncheckedCreateWithoutDashboardInput[]
    connectOrCreate?: ReceitaCategoriaCreateOrConnectWithoutDashboardInput | ReceitaCategoriaCreateOrConnectWithoutDashboardInput[]
    createMany?: ReceitaCategoriaCreateManyDashboardInputEnvelope
    connect?: ReceitaCategoriaWhereUniqueInput | ReceitaCategoriaWhereUniqueInput[]
  }

  export type ReceitaMetodoPagamentoCreateNestedManyWithoutDashboardInput = {
    create?: XOR<ReceitaMetodoPagamentoCreateWithoutDashboardInput, ReceitaMetodoPagamentoUncheckedCreateWithoutDashboardInput> | ReceitaMetodoPagamentoCreateWithoutDashboardInput[] | ReceitaMetodoPagamentoUncheckedCreateWithoutDashboardInput[]
    connectOrCreate?: ReceitaMetodoPagamentoCreateOrConnectWithoutDashboardInput | ReceitaMetodoPagamentoCreateOrConnectWithoutDashboardInput[]
    createMany?: ReceitaMetodoPagamentoCreateManyDashboardInputEnvelope
    connect?: ReceitaMetodoPagamentoWhereUniqueInput | ReceitaMetodoPagamentoWhereUniqueInput[]
  }

  export type ClientesRecorrentesVsUnicosUncheckedCreateNestedManyWithoutDashboardInput = {
    create?: XOR<ClientesRecorrentesVsUnicosCreateWithoutDashboardInput, ClientesRecorrentesVsUnicosUncheckedCreateWithoutDashboardInput> | ClientesRecorrentesVsUnicosCreateWithoutDashboardInput[] | ClientesRecorrentesVsUnicosUncheckedCreateWithoutDashboardInput[]
    connectOrCreate?: ClientesRecorrentesVsUnicosCreateOrConnectWithoutDashboardInput | ClientesRecorrentesVsUnicosCreateOrConnectWithoutDashboardInput[]
    createMany?: ClientesRecorrentesVsUnicosCreateManyDashboardInputEnvelope
    connect?: ClientesRecorrentesVsUnicosWhereUniqueInput | ClientesRecorrentesVsUnicosWhereUniqueInput[]
  }

  export type ProdutoRankUncheckedCreateNestedManyWithoutDashboardInput = {
    create?: XOR<ProdutoRankCreateWithoutDashboardInput, ProdutoRankUncheckedCreateWithoutDashboardInput> | ProdutoRankCreateWithoutDashboardInput[] | ProdutoRankUncheckedCreateWithoutDashboardInput[]
    connectOrCreate?: ProdutoRankCreateOrConnectWithoutDashboardInput | ProdutoRankCreateOrConnectWithoutDashboardInput[]
    createMany?: ProdutoRankCreateManyDashboardInputEnvelope
    connect?: ProdutoRankWhereUniqueInput | ProdutoRankWhereUniqueInput[]
  }

  export type ReceitaCategoriaUncheckedCreateNestedManyWithoutDashboardInput = {
    create?: XOR<ReceitaCategoriaCreateWithoutDashboardInput, ReceitaCategoriaUncheckedCreateWithoutDashboardInput> | ReceitaCategoriaCreateWithoutDashboardInput[] | ReceitaCategoriaUncheckedCreateWithoutDashboardInput[]
    connectOrCreate?: ReceitaCategoriaCreateOrConnectWithoutDashboardInput | ReceitaCategoriaCreateOrConnectWithoutDashboardInput[]
    createMany?: ReceitaCategoriaCreateManyDashboardInputEnvelope
    connect?: ReceitaCategoriaWhereUniqueInput | ReceitaCategoriaWhereUniqueInput[]
  }

  export type ReceitaMetodoPagamentoUncheckedCreateNestedManyWithoutDashboardInput = {
    create?: XOR<ReceitaMetodoPagamentoCreateWithoutDashboardInput, ReceitaMetodoPagamentoUncheckedCreateWithoutDashboardInput> | ReceitaMetodoPagamentoCreateWithoutDashboardInput[] | ReceitaMetodoPagamentoUncheckedCreateWithoutDashboardInput[]
    connectOrCreate?: ReceitaMetodoPagamentoCreateOrConnectWithoutDashboardInput | ReceitaMetodoPagamentoCreateOrConnectWithoutDashboardInput[]
    createMany?: ReceitaMetodoPagamentoCreateManyDashboardInputEnvelope
    connect?: ReceitaMetodoPagamentoWhereUniqueInput | ReceitaMetodoPagamentoWhereUniqueInput[]
  }

  export type ClientesRecorrentesVsUnicosUpdateManyWithoutDashboardNestedInput = {
    create?: XOR<ClientesRecorrentesVsUnicosCreateWithoutDashboardInput, ClientesRecorrentesVsUnicosUncheckedCreateWithoutDashboardInput> | ClientesRecorrentesVsUnicosCreateWithoutDashboardInput[] | ClientesRecorrentesVsUnicosUncheckedCreateWithoutDashboardInput[]
    connectOrCreate?: ClientesRecorrentesVsUnicosCreateOrConnectWithoutDashboardInput | ClientesRecorrentesVsUnicosCreateOrConnectWithoutDashboardInput[]
    upsert?: ClientesRecorrentesVsUnicosUpsertWithWhereUniqueWithoutDashboardInput | ClientesRecorrentesVsUnicosUpsertWithWhereUniqueWithoutDashboardInput[]
    createMany?: ClientesRecorrentesVsUnicosCreateManyDashboardInputEnvelope
    set?: ClientesRecorrentesVsUnicosWhereUniqueInput | ClientesRecorrentesVsUnicosWhereUniqueInput[]
    disconnect?: ClientesRecorrentesVsUnicosWhereUniqueInput | ClientesRecorrentesVsUnicosWhereUniqueInput[]
    delete?: ClientesRecorrentesVsUnicosWhereUniqueInput | ClientesRecorrentesVsUnicosWhereUniqueInput[]
    connect?: ClientesRecorrentesVsUnicosWhereUniqueInput | ClientesRecorrentesVsUnicosWhereUniqueInput[]
    update?: ClientesRecorrentesVsUnicosUpdateWithWhereUniqueWithoutDashboardInput | ClientesRecorrentesVsUnicosUpdateWithWhereUniqueWithoutDashboardInput[]
    updateMany?: ClientesRecorrentesVsUnicosUpdateManyWithWhereWithoutDashboardInput | ClientesRecorrentesVsUnicosUpdateManyWithWhereWithoutDashboardInput[]
    deleteMany?: ClientesRecorrentesVsUnicosScalarWhereInput | ClientesRecorrentesVsUnicosScalarWhereInput[]
  }

  export type OrganizationUpdateOneRequiredWithoutDashboardComercialNestedInput = {
    create?: XOR<OrganizationCreateWithoutDashboardComercialInput, OrganizationUncheckedCreateWithoutDashboardComercialInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutDashboardComercialInput
    upsert?: OrganizationUpsertWithoutDashboardComercialInput
    connect?: OrganizationWhereUniqueInput
    update?: XOR<XOR<OrganizationUpdateToOneWithWhereWithoutDashboardComercialInput, OrganizationUpdateWithoutDashboardComercialInput>, OrganizationUncheckedUpdateWithoutDashboardComercialInput>
  }

  export type ProdutoRankUpdateManyWithoutDashboardNestedInput = {
    create?: XOR<ProdutoRankCreateWithoutDashboardInput, ProdutoRankUncheckedCreateWithoutDashboardInput> | ProdutoRankCreateWithoutDashboardInput[] | ProdutoRankUncheckedCreateWithoutDashboardInput[]
    connectOrCreate?: ProdutoRankCreateOrConnectWithoutDashboardInput | ProdutoRankCreateOrConnectWithoutDashboardInput[]
    upsert?: ProdutoRankUpsertWithWhereUniqueWithoutDashboardInput | ProdutoRankUpsertWithWhereUniqueWithoutDashboardInput[]
    createMany?: ProdutoRankCreateManyDashboardInputEnvelope
    set?: ProdutoRankWhereUniqueInput | ProdutoRankWhereUniqueInput[]
    disconnect?: ProdutoRankWhereUniqueInput | ProdutoRankWhereUniqueInput[]
    delete?: ProdutoRankWhereUniqueInput | ProdutoRankWhereUniqueInput[]
    connect?: ProdutoRankWhereUniqueInput | ProdutoRankWhereUniqueInput[]
    update?: ProdutoRankUpdateWithWhereUniqueWithoutDashboardInput | ProdutoRankUpdateWithWhereUniqueWithoutDashboardInput[]
    updateMany?: ProdutoRankUpdateManyWithWhereWithoutDashboardInput | ProdutoRankUpdateManyWithWhereWithoutDashboardInput[]
    deleteMany?: ProdutoRankScalarWhereInput | ProdutoRankScalarWhereInput[]
  }

  export type ReceitaCategoriaUpdateManyWithoutDashboardNestedInput = {
    create?: XOR<ReceitaCategoriaCreateWithoutDashboardInput, ReceitaCategoriaUncheckedCreateWithoutDashboardInput> | ReceitaCategoriaCreateWithoutDashboardInput[] | ReceitaCategoriaUncheckedCreateWithoutDashboardInput[]
    connectOrCreate?: ReceitaCategoriaCreateOrConnectWithoutDashboardInput | ReceitaCategoriaCreateOrConnectWithoutDashboardInput[]
    upsert?: ReceitaCategoriaUpsertWithWhereUniqueWithoutDashboardInput | ReceitaCategoriaUpsertWithWhereUniqueWithoutDashboardInput[]
    createMany?: ReceitaCategoriaCreateManyDashboardInputEnvelope
    set?: ReceitaCategoriaWhereUniqueInput | ReceitaCategoriaWhereUniqueInput[]
    disconnect?: ReceitaCategoriaWhereUniqueInput | ReceitaCategoriaWhereUniqueInput[]
    delete?: ReceitaCategoriaWhereUniqueInput | ReceitaCategoriaWhereUniqueInput[]
    connect?: ReceitaCategoriaWhereUniqueInput | ReceitaCategoriaWhereUniqueInput[]
    update?: ReceitaCategoriaUpdateWithWhereUniqueWithoutDashboardInput | ReceitaCategoriaUpdateWithWhereUniqueWithoutDashboardInput[]
    updateMany?: ReceitaCategoriaUpdateManyWithWhereWithoutDashboardInput | ReceitaCategoriaUpdateManyWithWhereWithoutDashboardInput[]
    deleteMany?: ReceitaCategoriaScalarWhereInput | ReceitaCategoriaScalarWhereInput[]
  }

  export type ReceitaMetodoPagamentoUpdateManyWithoutDashboardNestedInput = {
    create?: XOR<ReceitaMetodoPagamentoCreateWithoutDashboardInput, ReceitaMetodoPagamentoUncheckedCreateWithoutDashboardInput> | ReceitaMetodoPagamentoCreateWithoutDashboardInput[] | ReceitaMetodoPagamentoUncheckedCreateWithoutDashboardInput[]
    connectOrCreate?: ReceitaMetodoPagamentoCreateOrConnectWithoutDashboardInput | ReceitaMetodoPagamentoCreateOrConnectWithoutDashboardInput[]
    upsert?: ReceitaMetodoPagamentoUpsertWithWhereUniqueWithoutDashboardInput | ReceitaMetodoPagamentoUpsertWithWhereUniqueWithoutDashboardInput[]
    createMany?: ReceitaMetodoPagamentoCreateManyDashboardInputEnvelope
    set?: ReceitaMetodoPagamentoWhereUniqueInput | ReceitaMetodoPagamentoWhereUniqueInput[]
    disconnect?: ReceitaMetodoPagamentoWhereUniqueInput | ReceitaMetodoPagamentoWhereUniqueInput[]
    delete?: ReceitaMetodoPagamentoWhereUniqueInput | ReceitaMetodoPagamentoWhereUniqueInput[]
    connect?: ReceitaMetodoPagamentoWhereUniqueInput | ReceitaMetodoPagamentoWhereUniqueInput[]
    update?: ReceitaMetodoPagamentoUpdateWithWhereUniqueWithoutDashboardInput | ReceitaMetodoPagamentoUpdateWithWhereUniqueWithoutDashboardInput[]
    updateMany?: ReceitaMetodoPagamentoUpdateManyWithWhereWithoutDashboardInput | ReceitaMetodoPagamentoUpdateManyWithWhereWithoutDashboardInput[]
    deleteMany?: ReceitaMetodoPagamentoScalarWhereInput | ReceitaMetodoPagamentoScalarWhereInput[]
  }

  export type ClientesRecorrentesVsUnicosUncheckedUpdateManyWithoutDashboardNestedInput = {
    create?: XOR<ClientesRecorrentesVsUnicosCreateWithoutDashboardInput, ClientesRecorrentesVsUnicosUncheckedCreateWithoutDashboardInput> | ClientesRecorrentesVsUnicosCreateWithoutDashboardInput[] | ClientesRecorrentesVsUnicosUncheckedCreateWithoutDashboardInput[]
    connectOrCreate?: ClientesRecorrentesVsUnicosCreateOrConnectWithoutDashboardInput | ClientesRecorrentesVsUnicosCreateOrConnectWithoutDashboardInput[]
    upsert?: ClientesRecorrentesVsUnicosUpsertWithWhereUniqueWithoutDashboardInput | ClientesRecorrentesVsUnicosUpsertWithWhereUniqueWithoutDashboardInput[]
    createMany?: ClientesRecorrentesVsUnicosCreateManyDashboardInputEnvelope
    set?: ClientesRecorrentesVsUnicosWhereUniqueInput | ClientesRecorrentesVsUnicosWhereUniqueInput[]
    disconnect?: ClientesRecorrentesVsUnicosWhereUniqueInput | ClientesRecorrentesVsUnicosWhereUniqueInput[]
    delete?: ClientesRecorrentesVsUnicosWhereUniqueInput | ClientesRecorrentesVsUnicosWhereUniqueInput[]
    connect?: ClientesRecorrentesVsUnicosWhereUniqueInput | ClientesRecorrentesVsUnicosWhereUniqueInput[]
    update?: ClientesRecorrentesVsUnicosUpdateWithWhereUniqueWithoutDashboardInput | ClientesRecorrentesVsUnicosUpdateWithWhereUniqueWithoutDashboardInput[]
    updateMany?: ClientesRecorrentesVsUnicosUpdateManyWithWhereWithoutDashboardInput | ClientesRecorrentesVsUnicosUpdateManyWithWhereWithoutDashboardInput[]
    deleteMany?: ClientesRecorrentesVsUnicosScalarWhereInput | ClientesRecorrentesVsUnicosScalarWhereInput[]
  }

  export type ProdutoRankUncheckedUpdateManyWithoutDashboardNestedInput = {
    create?: XOR<ProdutoRankCreateWithoutDashboardInput, ProdutoRankUncheckedCreateWithoutDashboardInput> | ProdutoRankCreateWithoutDashboardInput[] | ProdutoRankUncheckedCreateWithoutDashboardInput[]
    connectOrCreate?: ProdutoRankCreateOrConnectWithoutDashboardInput | ProdutoRankCreateOrConnectWithoutDashboardInput[]
    upsert?: ProdutoRankUpsertWithWhereUniqueWithoutDashboardInput | ProdutoRankUpsertWithWhereUniqueWithoutDashboardInput[]
    createMany?: ProdutoRankCreateManyDashboardInputEnvelope
    set?: ProdutoRankWhereUniqueInput | ProdutoRankWhereUniqueInput[]
    disconnect?: ProdutoRankWhereUniqueInput | ProdutoRankWhereUniqueInput[]
    delete?: ProdutoRankWhereUniqueInput | ProdutoRankWhereUniqueInput[]
    connect?: ProdutoRankWhereUniqueInput | ProdutoRankWhereUniqueInput[]
    update?: ProdutoRankUpdateWithWhereUniqueWithoutDashboardInput | ProdutoRankUpdateWithWhereUniqueWithoutDashboardInput[]
    updateMany?: ProdutoRankUpdateManyWithWhereWithoutDashboardInput | ProdutoRankUpdateManyWithWhereWithoutDashboardInput[]
    deleteMany?: ProdutoRankScalarWhereInput | ProdutoRankScalarWhereInput[]
  }

  export type ReceitaCategoriaUncheckedUpdateManyWithoutDashboardNestedInput = {
    create?: XOR<ReceitaCategoriaCreateWithoutDashboardInput, ReceitaCategoriaUncheckedCreateWithoutDashboardInput> | ReceitaCategoriaCreateWithoutDashboardInput[] | ReceitaCategoriaUncheckedCreateWithoutDashboardInput[]
    connectOrCreate?: ReceitaCategoriaCreateOrConnectWithoutDashboardInput | ReceitaCategoriaCreateOrConnectWithoutDashboardInput[]
    upsert?: ReceitaCategoriaUpsertWithWhereUniqueWithoutDashboardInput | ReceitaCategoriaUpsertWithWhereUniqueWithoutDashboardInput[]
    createMany?: ReceitaCategoriaCreateManyDashboardInputEnvelope
    set?: ReceitaCategoriaWhereUniqueInput | ReceitaCategoriaWhereUniqueInput[]
    disconnect?: ReceitaCategoriaWhereUniqueInput | ReceitaCategoriaWhereUniqueInput[]
    delete?: ReceitaCategoriaWhereUniqueInput | ReceitaCategoriaWhereUniqueInput[]
    connect?: ReceitaCategoriaWhereUniqueInput | ReceitaCategoriaWhereUniqueInput[]
    update?: ReceitaCategoriaUpdateWithWhereUniqueWithoutDashboardInput | ReceitaCategoriaUpdateWithWhereUniqueWithoutDashboardInput[]
    updateMany?: ReceitaCategoriaUpdateManyWithWhereWithoutDashboardInput | ReceitaCategoriaUpdateManyWithWhereWithoutDashboardInput[]
    deleteMany?: ReceitaCategoriaScalarWhereInput | ReceitaCategoriaScalarWhereInput[]
  }

  export type ReceitaMetodoPagamentoUncheckedUpdateManyWithoutDashboardNestedInput = {
    create?: XOR<ReceitaMetodoPagamentoCreateWithoutDashboardInput, ReceitaMetodoPagamentoUncheckedCreateWithoutDashboardInput> | ReceitaMetodoPagamentoCreateWithoutDashboardInput[] | ReceitaMetodoPagamentoUncheckedCreateWithoutDashboardInput[]
    connectOrCreate?: ReceitaMetodoPagamentoCreateOrConnectWithoutDashboardInput | ReceitaMetodoPagamentoCreateOrConnectWithoutDashboardInput[]
    upsert?: ReceitaMetodoPagamentoUpsertWithWhereUniqueWithoutDashboardInput | ReceitaMetodoPagamentoUpsertWithWhereUniqueWithoutDashboardInput[]
    createMany?: ReceitaMetodoPagamentoCreateManyDashboardInputEnvelope
    set?: ReceitaMetodoPagamentoWhereUniqueInput | ReceitaMetodoPagamentoWhereUniqueInput[]
    disconnect?: ReceitaMetodoPagamentoWhereUniqueInput | ReceitaMetodoPagamentoWhereUniqueInput[]
    delete?: ReceitaMetodoPagamentoWhereUniqueInput | ReceitaMetodoPagamentoWhereUniqueInput[]
    connect?: ReceitaMetodoPagamentoWhereUniqueInput | ReceitaMetodoPagamentoWhereUniqueInput[]
    update?: ReceitaMetodoPagamentoUpdateWithWhereUniqueWithoutDashboardInput | ReceitaMetodoPagamentoUpdateWithWhereUniqueWithoutDashboardInput[]
    updateMany?: ReceitaMetodoPagamentoUpdateManyWithWhereWithoutDashboardInput | ReceitaMetodoPagamentoUpdateManyWithWhereWithoutDashboardInput[]
    deleteMany?: ReceitaMetodoPagamentoScalarWhereInput | ReceitaMetodoPagamentoScalarWhereInput[]
  }

  export type DashboardComercialCreateNestedOneWithoutReceitaPorCategoriaInput = {
    create?: XOR<DashboardComercialCreateWithoutReceitaPorCategoriaInput, DashboardComercialUncheckedCreateWithoutReceitaPorCategoriaInput>
    connectOrCreate?: DashboardComercialCreateOrConnectWithoutReceitaPorCategoriaInput
    connect?: DashboardComercialWhereUniqueInput
  }

  export type DashboardComercialUpdateOneRequiredWithoutReceitaPorCategoriaNestedInput = {
    create?: XOR<DashboardComercialCreateWithoutReceitaPorCategoriaInput, DashboardComercialUncheckedCreateWithoutReceitaPorCategoriaInput>
    connectOrCreate?: DashboardComercialCreateOrConnectWithoutReceitaPorCategoriaInput
    upsert?: DashboardComercialUpsertWithoutReceitaPorCategoriaInput
    connect?: DashboardComercialWhereUniqueInput
    update?: XOR<XOR<DashboardComercialUpdateToOneWithWhereWithoutReceitaPorCategoriaInput, DashboardComercialUpdateWithoutReceitaPorCategoriaInput>, DashboardComercialUncheckedUpdateWithoutReceitaPorCategoriaInput>
  }

  export type DashboardComercialCreateNestedOneWithoutReceitaPorPagamentoInput = {
    create?: XOR<DashboardComercialCreateWithoutReceitaPorPagamentoInput, DashboardComercialUncheckedCreateWithoutReceitaPorPagamentoInput>
    connectOrCreate?: DashboardComercialCreateOrConnectWithoutReceitaPorPagamentoInput
    connect?: DashboardComercialWhereUniqueInput
  }

  export type DashboardComercialUpdateOneRequiredWithoutReceitaPorPagamentoNestedInput = {
    create?: XOR<DashboardComercialCreateWithoutReceitaPorPagamentoInput, DashboardComercialUncheckedCreateWithoutReceitaPorPagamentoInput>
    connectOrCreate?: DashboardComercialCreateOrConnectWithoutReceitaPorPagamentoInput
    upsert?: DashboardComercialUpsertWithoutReceitaPorPagamentoInput
    connect?: DashboardComercialWhereUniqueInput
    update?: XOR<XOR<DashboardComercialUpdateToOneWithWhereWithoutReceitaPorPagamentoInput, DashboardComercialUpdateWithoutReceitaPorPagamentoInput>, DashboardComercialUncheckedUpdateWithoutReceitaPorPagamentoInput>
  }

  export type DashboardComercialCreateNestedOneWithoutClientesComparacaoInput = {
    create?: XOR<DashboardComercialCreateWithoutClientesComparacaoInput, DashboardComercialUncheckedCreateWithoutClientesComparacaoInput>
    connectOrCreate?: DashboardComercialCreateOrConnectWithoutClientesComparacaoInput
    connect?: DashboardComercialWhereUniqueInput
  }

  export type DashboardComercialUpdateOneRequiredWithoutClientesComparacaoNestedInput = {
    create?: XOR<DashboardComercialCreateWithoutClientesComparacaoInput, DashboardComercialUncheckedCreateWithoutClientesComparacaoInput>
    connectOrCreate?: DashboardComercialCreateOrConnectWithoutClientesComparacaoInput
    upsert?: DashboardComercialUpsertWithoutClientesComparacaoInput
    connect?: DashboardComercialWhereUniqueInput
    update?: XOR<XOR<DashboardComercialUpdateToOneWithWhereWithoutClientesComparacaoInput, DashboardComercialUpdateWithoutClientesComparacaoInput>, DashboardComercialUncheckedUpdateWithoutClientesComparacaoInput>
  }

  export type DashboardComercialCreateNestedOneWithoutProdutosTopInput = {
    create?: XOR<DashboardComercialCreateWithoutProdutosTopInput, DashboardComercialUncheckedCreateWithoutProdutosTopInput>
    connectOrCreate?: DashboardComercialCreateOrConnectWithoutProdutosTopInput
    connect?: DashboardComercialWhereUniqueInput
  }

  export type DashboardComercialUpdateOneRequiredWithoutProdutosTopNestedInput = {
    create?: XOR<DashboardComercialCreateWithoutProdutosTopInput, DashboardComercialUncheckedCreateWithoutProdutosTopInput>
    connectOrCreate?: DashboardComercialCreateOrConnectWithoutProdutosTopInput
    upsert?: DashboardComercialUpsertWithoutProdutosTopInput
    connect?: DashboardComercialWhereUniqueInput
    update?: XOR<XOR<DashboardComercialUpdateToOneWithWhereWithoutProdutosTopInput, DashboardComercialUpdateWithoutProdutosTopInput>, DashboardComercialUncheckedUpdateWithoutProdutosTopInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type DashboardComercialCreateWithoutOrganizationInput = {
    id?: string
    receitaTotal: Decimal | DecimalJsLike | number | string
    ticketMedio: Decimal | DecimalJsLike | number | string
    crescimentoReceita: number
    novosClientes: number
    taxaRetencaoClientes: number
    clv: Decimal | DecimalJsLike | number | string
    volumeReparos: number
    taxaReincidenciaReparos: number
    receitaReparosVsVendas: number
    createdAt?: Date | string
    updatedAt?: Date | string
    clientesComparacao?: ClientesRecorrentesVsUnicosCreateNestedManyWithoutDashboardInput
    produtosTop?: ProdutoRankCreateNestedManyWithoutDashboardInput
    receitaPorCategoria?: ReceitaCategoriaCreateNestedManyWithoutDashboardInput
    receitaPorPagamento?: ReceitaMetodoPagamentoCreateNestedManyWithoutDashboardInput
  }

  export type DashboardComercialUncheckedCreateWithoutOrganizationInput = {
    id?: string
    receitaTotal: Decimal | DecimalJsLike | number | string
    ticketMedio: Decimal | DecimalJsLike | number | string
    crescimentoReceita: number
    novosClientes: number
    taxaRetencaoClientes: number
    clv: Decimal | DecimalJsLike | number | string
    volumeReparos: number
    taxaReincidenciaReparos: number
    receitaReparosVsVendas: number
    createdAt?: Date | string
    updatedAt?: Date | string
    clientesComparacao?: ClientesRecorrentesVsUnicosUncheckedCreateNestedManyWithoutDashboardInput
    produtosTop?: ProdutoRankUncheckedCreateNestedManyWithoutDashboardInput
    receitaPorCategoria?: ReceitaCategoriaUncheckedCreateNestedManyWithoutDashboardInput
    receitaPorPagamento?: ReceitaMetodoPagamentoUncheckedCreateNestedManyWithoutDashboardInput
  }

  export type DashboardComercialCreateOrConnectWithoutOrganizationInput = {
    where: DashboardComercialWhereUniqueInput
    create: XOR<DashboardComercialCreateWithoutOrganizationInput, DashboardComercialUncheckedCreateWithoutOrganizationInput>
  }

  export type DashboardMarketingCreateWithoutOrganizationInput = {
    id?: string
    sessoes: number
    usuarios: number
    taxaRejeicao: number
    taxaConversaoSite: number
    taxaAbandonoCarrinho: number
    impressoes: number
    cliques: number
    ctr: number
    cpc: Decimal | DecimalJsLike | number | string
    conversoes: number
    custoPorConversao: Decimal | DecimalJsLike | number | string
    roas: number
    custoPorLead: Decimal | DecimalJsLike | number | string
    faturamentoTotal: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    anunciosCTR?: AnuncioCTRCreateNestedManyWithoutDashboardInput
    anunciosConv?: AnuncioConversaoCreateNestedManyWithoutDashboardInput
    canais?: CanalTrafegoCreateNestedManyWithoutDashboardInput
    palavrasChave?: PalavraChaveCreateNestedManyWithoutDashboardInput
    trafego?: TrafegoCreateNestedManyWithoutDashboardInput
  }

  export type DashboardMarketingUncheckedCreateWithoutOrganizationInput = {
    id?: string
    sessoes: number
    usuarios: number
    taxaRejeicao: number
    taxaConversaoSite: number
    taxaAbandonoCarrinho: number
    impressoes: number
    cliques: number
    ctr: number
    cpc: Decimal | DecimalJsLike | number | string
    conversoes: number
    custoPorConversao: Decimal | DecimalJsLike | number | string
    roas: number
    custoPorLead: Decimal | DecimalJsLike | number | string
    faturamentoTotal: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    anunciosCTR?: AnuncioCTRUncheckedCreateNestedManyWithoutDashboardInput
    anunciosConv?: AnuncioConversaoUncheckedCreateNestedManyWithoutDashboardInput
    canais?: CanalTrafegoUncheckedCreateNestedManyWithoutDashboardInput
    palavrasChave?: PalavraChaveUncheckedCreateNestedManyWithoutDashboardInput
    trafego?: TrafegoUncheckedCreateNestedManyWithoutDashboardInput
  }

  export type DashboardMarketingCreateOrConnectWithoutOrganizationInput = {
    where: DashboardMarketingWhereUniqueInput
    create: XOR<DashboardMarketingCreateWithoutOrganizationInput, DashboardMarketingUncheckedCreateWithoutOrganizationInput>
  }

  export type UserCreateWithoutOrganizationInput = {
    id?: string
    name: string
    email: string
    password: string
    role: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUncheckedCreateWithoutOrganizationInput = {
    id?: string
    name: string
    email: string
    password: string
    role: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserCreateOrConnectWithoutOrganizationInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOrganizationInput, UserUncheckedCreateWithoutOrganizationInput>
  }

  export type UserCreateManyOrganizationInputEnvelope = {
    data: UserCreateManyOrganizationInput | UserCreateManyOrganizationInput[]
    skipDuplicates?: boolean
  }

  export type DashboardComercialUpsertWithoutOrganizationInput = {
    update: XOR<DashboardComercialUpdateWithoutOrganizationInput, DashboardComercialUncheckedUpdateWithoutOrganizationInput>
    create: XOR<DashboardComercialCreateWithoutOrganizationInput, DashboardComercialUncheckedCreateWithoutOrganizationInput>
    where?: DashboardComercialWhereInput
  }

  export type DashboardComercialUpdateToOneWithWhereWithoutOrganizationInput = {
    where?: DashboardComercialWhereInput
    data: XOR<DashboardComercialUpdateWithoutOrganizationInput, DashboardComercialUncheckedUpdateWithoutOrganizationInput>
  }

  export type DashboardComercialUpdateWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    receitaTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ticketMedio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    crescimentoReceita?: FloatFieldUpdateOperationsInput | number
    novosClientes?: IntFieldUpdateOperationsInput | number
    taxaRetencaoClientes?: FloatFieldUpdateOperationsInput | number
    clv?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    volumeReparos?: IntFieldUpdateOperationsInput | number
    taxaReincidenciaReparos?: FloatFieldUpdateOperationsInput | number
    receitaReparosVsVendas?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clientesComparacao?: ClientesRecorrentesVsUnicosUpdateManyWithoutDashboardNestedInput
    produtosTop?: ProdutoRankUpdateManyWithoutDashboardNestedInput
    receitaPorCategoria?: ReceitaCategoriaUpdateManyWithoutDashboardNestedInput
    receitaPorPagamento?: ReceitaMetodoPagamentoUpdateManyWithoutDashboardNestedInput
  }

  export type DashboardComercialUncheckedUpdateWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    receitaTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ticketMedio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    crescimentoReceita?: FloatFieldUpdateOperationsInput | number
    novosClientes?: IntFieldUpdateOperationsInput | number
    taxaRetencaoClientes?: FloatFieldUpdateOperationsInput | number
    clv?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    volumeReparos?: IntFieldUpdateOperationsInput | number
    taxaReincidenciaReparos?: FloatFieldUpdateOperationsInput | number
    receitaReparosVsVendas?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clientesComparacao?: ClientesRecorrentesVsUnicosUncheckedUpdateManyWithoutDashboardNestedInput
    produtosTop?: ProdutoRankUncheckedUpdateManyWithoutDashboardNestedInput
    receitaPorCategoria?: ReceitaCategoriaUncheckedUpdateManyWithoutDashboardNestedInput
    receitaPorPagamento?: ReceitaMetodoPagamentoUncheckedUpdateManyWithoutDashboardNestedInput
  }

  export type DashboardMarketingUpsertWithoutOrganizationInput = {
    update: XOR<DashboardMarketingUpdateWithoutOrganizationInput, DashboardMarketingUncheckedUpdateWithoutOrganizationInput>
    create: XOR<DashboardMarketingCreateWithoutOrganizationInput, DashboardMarketingUncheckedCreateWithoutOrganizationInput>
    where?: DashboardMarketingWhereInput
  }

  export type DashboardMarketingUpdateToOneWithWhereWithoutOrganizationInput = {
    where?: DashboardMarketingWhereInput
    data: XOR<DashboardMarketingUpdateWithoutOrganizationInput, DashboardMarketingUncheckedUpdateWithoutOrganizationInput>
  }

  export type DashboardMarketingUpdateWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessoes?: IntFieldUpdateOperationsInput | number
    usuarios?: IntFieldUpdateOperationsInput | number
    taxaRejeicao?: FloatFieldUpdateOperationsInput | number
    taxaConversaoSite?: FloatFieldUpdateOperationsInput | number
    taxaAbandonoCarrinho?: FloatFieldUpdateOperationsInput | number
    impressoes?: IntFieldUpdateOperationsInput | number
    cliques?: IntFieldUpdateOperationsInput | number
    ctr?: FloatFieldUpdateOperationsInput | number
    cpc?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    conversoes?: IntFieldUpdateOperationsInput | number
    custoPorConversao?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    roas?: FloatFieldUpdateOperationsInput | number
    custoPorLead?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    faturamentoTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    anunciosCTR?: AnuncioCTRUpdateManyWithoutDashboardNestedInput
    anunciosConv?: AnuncioConversaoUpdateManyWithoutDashboardNestedInput
    canais?: CanalTrafegoUpdateManyWithoutDashboardNestedInput
    palavrasChave?: PalavraChaveUpdateManyWithoutDashboardNestedInput
    trafego?: TrafegoUpdateManyWithoutDashboardNestedInput
  }

  export type DashboardMarketingUncheckedUpdateWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessoes?: IntFieldUpdateOperationsInput | number
    usuarios?: IntFieldUpdateOperationsInput | number
    taxaRejeicao?: FloatFieldUpdateOperationsInput | number
    taxaConversaoSite?: FloatFieldUpdateOperationsInput | number
    taxaAbandonoCarrinho?: FloatFieldUpdateOperationsInput | number
    impressoes?: IntFieldUpdateOperationsInput | number
    cliques?: IntFieldUpdateOperationsInput | number
    ctr?: FloatFieldUpdateOperationsInput | number
    cpc?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    conversoes?: IntFieldUpdateOperationsInput | number
    custoPorConversao?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    roas?: FloatFieldUpdateOperationsInput | number
    custoPorLead?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    faturamentoTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    anunciosCTR?: AnuncioCTRUncheckedUpdateManyWithoutDashboardNestedInput
    anunciosConv?: AnuncioConversaoUncheckedUpdateManyWithoutDashboardNestedInput
    canais?: CanalTrafegoUncheckedUpdateManyWithoutDashboardNestedInput
    palavrasChave?: PalavraChaveUncheckedUpdateManyWithoutDashboardNestedInput
    trafego?: TrafegoUncheckedUpdateManyWithoutDashboardNestedInput
  }

  export type UserUpsertWithWhereUniqueWithoutOrganizationInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutOrganizationInput, UserUncheckedUpdateWithoutOrganizationInput>
    create: XOR<UserCreateWithoutOrganizationInput, UserUncheckedCreateWithoutOrganizationInput>
  }

  export type UserUpdateWithWhereUniqueWithoutOrganizationInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutOrganizationInput, UserUncheckedUpdateWithoutOrganizationInput>
  }

  export type UserUpdateManyWithWhereWithoutOrganizationInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutOrganizationInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    organizationId?: StringFilter<"User"> | string
  }

  export type OrganizationCreateWithoutUsersInput = {
    id?: string
    name: string
    googleAccessToken?: string | null
    googleRefreshToken?: string | null
    googleScopes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    googleExpiresIn?: number | null
    dashboardComercial?: DashboardComercialCreateNestedOneWithoutOrganizationInput
    dashboardMarketing?: DashboardMarketingCreateNestedOneWithoutOrganizationInput
  }

  export type OrganizationUncheckedCreateWithoutUsersInput = {
    id?: string
    name: string
    googleAccessToken?: string | null
    googleRefreshToken?: string | null
    googleScopes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    googleExpiresIn?: number | null
    dashboardComercial?: DashboardComercialUncheckedCreateNestedOneWithoutOrganizationInput
    dashboardMarketing?: DashboardMarketingUncheckedCreateNestedOneWithoutOrganizationInput
  }

  export type OrganizationCreateOrConnectWithoutUsersInput = {
    where: OrganizationWhereUniqueInput
    create: XOR<OrganizationCreateWithoutUsersInput, OrganizationUncheckedCreateWithoutUsersInput>
  }

  export type OrganizationUpsertWithoutUsersInput = {
    update: XOR<OrganizationUpdateWithoutUsersInput, OrganizationUncheckedUpdateWithoutUsersInput>
    create: XOR<OrganizationCreateWithoutUsersInput, OrganizationUncheckedCreateWithoutUsersInput>
    where?: OrganizationWhereInput
  }

  export type OrganizationUpdateToOneWithWhereWithoutUsersInput = {
    where?: OrganizationWhereInput
    data: XOR<OrganizationUpdateWithoutUsersInput, OrganizationUncheckedUpdateWithoutUsersInput>
  }

  export type OrganizationUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    googleAccessToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleRefreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleScopes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    googleExpiresIn?: NullableFloatFieldUpdateOperationsInput | number | null
    dashboardComercial?: DashboardComercialUpdateOneWithoutOrganizationNestedInput
    dashboardMarketing?: DashboardMarketingUpdateOneWithoutOrganizationNestedInput
  }

  export type OrganizationUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    googleAccessToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleRefreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleScopes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    googleExpiresIn?: NullableFloatFieldUpdateOperationsInput | number | null
    dashboardComercial?: DashboardComercialUncheckedUpdateOneWithoutOrganizationNestedInput
    dashboardMarketing?: DashboardMarketingUncheckedUpdateOneWithoutOrganizationNestedInput
  }

  export type AnuncioCTRCreateWithoutDashboardInput = {
    id?: string
    nome: string
    ctr: number
  }

  export type AnuncioCTRUncheckedCreateWithoutDashboardInput = {
    id?: string
    nome: string
    ctr: number
  }

  export type AnuncioCTRCreateOrConnectWithoutDashboardInput = {
    where: AnuncioCTRWhereUniqueInput
    create: XOR<AnuncioCTRCreateWithoutDashboardInput, AnuncioCTRUncheckedCreateWithoutDashboardInput>
  }

  export type AnuncioCTRCreateManyDashboardInputEnvelope = {
    data: AnuncioCTRCreateManyDashboardInput | AnuncioCTRCreateManyDashboardInput[]
    skipDuplicates?: boolean
  }

  export type AnuncioConversaoCreateWithoutDashboardInput = {
    id?: string
    nome: string
    conversoes: number
  }

  export type AnuncioConversaoUncheckedCreateWithoutDashboardInput = {
    id?: string
    nome: string
    conversoes: number
  }

  export type AnuncioConversaoCreateOrConnectWithoutDashboardInput = {
    where: AnuncioConversaoWhereUniqueInput
    create: XOR<AnuncioConversaoCreateWithoutDashboardInput, AnuncioConversaoUncheckedCreateWithoutDashboardInput>
  }

  export type AnuncioConversaoCreateManyDashboardInputEnvelope = {
    data: AnuncioConversaoCreateManyDashboardInput | AnuncioConversaoCreateManyDashboardInput[]
    skipDuplicates?: boolean
  }

  export type CanalTrafegoCreateWithoutDashboardInput = {
    id?: string
    canal: string
    taxaConversao: number
    cpa: Decimal | DecimalJsLike | number | string
    roi: number
  }

  export type CanalTrafegoUncheckedCreateWithoutDashboardInput = {
    id?: string
    canal: string
    taxaConversao: number
    cpa: Decimal | DecimalJsLike | number | string
    roi: number
  }

  export type CanalTrafegoCreateOrConnectWithoutDashboardInput = {
    where: CanalTrafegoWhereUniqueInput
    create: XOR<CanalTrafegoCreateWithoutDashboardInput, CanalTrafegoUncheckedCreateWithoutDashboardInput>
  }

  export type CanalTrafegoCreateManyDashboardInputEnvelope = {
    data: CanalTrafegoCreateManyDashboardInput | CanalTrafegoCreateManyDashboardInput[]
    skipDuplicates?: boolean
  }

  export type OrganizationCreateWithoutDashboardMarketingInput = {
    id?: string
    name: string
    googleAccessToken?: string | null
    googleRefreshToken?: string | null
    googleScopes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    googleExpiresIn?: number | null
    dashboardComercial?: DashboardComercialCreateNestedOneWithoutOrganizationInput
    users?: UserCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationUncheckedCreateWithoutDashboardMarketingInput = {
    id?: string
    name: string
    googleAccessToken?: string | null
    googleRefreshToken?: string | null
    googleScopes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    googleExpiresIn?: number | null
    dashboardComercial?: DashboardComercialUncheckedCreateNestedOneWithoutOrganizationInput
    users?: UserUncheckedCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationCreateOrConnectWithoutDashboardMarketingInput = {
    where: OrganizationWhereUniqueInput
    create: XOR<OrganizationCreateWithoutDashboardMarketingInput, OrganizationUncheckedCreateWithoutDashboardMarketingInput>
  }

  export type PalavraChaveCreateWithoutDashboardInput = {
    id?: string
    palavra: string
    ctr: number
  }

  export type PalavraChaveUncheckedCreateWithoutDashboardInput = {
    id?: string
    palavra: string
    ctr: number
  }

  export type PalavraChaveCreateOrConnectWithoutDashboardInput = {
    where: PalavraChaveWhereUniqueInput
    create: XOR<PalavraChaveCreateWithoutDashboardInput, PalavraChaveUncheckedCreateWithoutDashboardInput>
  }

  export type PalavraChaveCreateManyDashboardInputEnvelope = {
    data: PalavraChaveCreateManyDashboardInput | PalavraChaveCreateManyDashboardInput[]
    skipDuplicates?: boolean
  }

  export type TrafegoCreateWithoutDashboardInput = {
    id?: string
    origem: string
    valor: number
  }

  export type TrafegoUncheckedCreateWithoutDashboardInput = {
    id?: string
    origem: string
    valor: number
  }

  export type TrafegoCreateOrConnectWithoutDashboardInput = {
    where: TrafegoWhereUniqueInput
    create: XOR<TrafegoCreateWithoutDashboardInput, TrafegoUncheckedCreateWithoutDashboardInput>
  }

  export type TrafegoCreateManyDashboardInputEnvelope = {
    data: TrafegoCreateManyDashboardInput | TrafegoCreateManyDashboardInput[]
    skipDuplicates?: boolean
  }

  export type AnuncioCTRUpsertWithWhereUniqueWithoutDashboardInput = {
    where: AnuncioCTRWhereUniqueInput
    update: XOR<AnuncioCTRUpdateWithoutDashboardInput, AnuncioCTRUncheckedUpdateWithoutDashboardInput>
    create: XOR<AnuncioCTRCreateWithoutDashboardInput, AnuncioCTRUncheckedCreateWithoutDashboardInput>
  }

  export type AnuncioCTRUpdateWithWhereUniqueWithoutDashboardInput = {
    where: AnuncioCTRWhereUniqueInput
    data: XOR<AnuncioCTRUpdateWithoutDashboardInput, AnuncioCTRUncheckedUpdateWithoutDashboardInput>
  }

  export type AnuncioCTRUpdateManyWithWhereWithoutDashboardInput = {
    where: AnuncioCTRScalarWhereInput
    data: XOR<AnuncioCTRUpdateManyMutationInput, AnuncioCTRUncheckedUpdateManyWithoutDashboardInput>
  }

  export type AnuncioCTRScalarWhereInput = {
    AND?: AnuncioCTRScalarWhereInput | AnuncioCTRScalarWhereInput[]
    OR?: AnuncioCTRScalarWhereInput[]
    NOT?: AnuncioCTRScalarWhereInput | AnuncioCTRScalarWhereInput[]
    id?: StringFilter<"AnuncioCTR"> | string
    dashboardId?: StringFilter<"AnuncioCTR"> | string
    nome?: StringFilter<"AnuncioCTR"> | string
    ctr?: FloatFilter<"AnuncioCTR"> | number
  }

  export type AnuncioConversaoUpsertWithWhereUniqueWithoutDashboardInput = {
    where: AnuncioConversaoWhereUniqueInput
    update: XOR<AnuncioConversaoUpdateWithoutDashboardInput, AnuncioConversaoUncheckedUpdateWithoutDashboardInput>
    create: XOR<AnuncioConversaoCreateWithoutDashboardInput, AnuncioConversaoUncheckedCreateWithoutDashboardInput>
  }

  export type AnuncioConversaoUpdateWithWhereUniqueWithoutDashboardInput = {
    where: AnuncioConversaoWhereUniqueInput
    data: XOR<AnuncioConversaoUpdateWithoutDashboardInput, AnuncioConversaoUncheckedUpdateWithoutDashboardInput>
  }

  export type AnuncioConversaoUpdateManyWithWhereWithoutDashboardInput = {
    where: AnuncioConversaoScalarWhereInput
    data: XOR<AnuncioConversaoUpdateManyMutationInput, AnuncioConversaoUncheckedUpdateManyWithoutDashboardInput>
  }

  export type AnuncioConversaoScalarWhereInput = {
    AND?: AnuncioConversaoScalarWhereInput | AnuncioConversaoScalarWhereInput[]
    OR?: AnuncioConversaoScalarWhereInput[]
    NOT?: AnuncioConversaoScalarWhereInput | AnuncioConversaoScalarWhereInput[]
    id?: StringFilter<"AnuncioConversao"> | string
    dashboardId?: StringFilter<"AnuncioConversao"> | string
    nome?: StringFilter<"AnuncioConversao"> | string
    conversoes?: IntFilter<"AnuncioConversao"> | number
  }

  export type CanalTrafegoUpsertWithWhereUniqueWithoutDashboardInput = {
    where: CanalTrafegoWhereUniqueInput
    update: XOR<CanalTrafegoUpdateWithoutDashboardInput, CanalTrafegoUncheckedUpdateWithoutDashboardInput>
    create: XOR<CanalTrafegoCreateWithoutDashboardInput, CanalTrafegoUncheckedCreateWithoutDashboardInput>
  }

  export type CanalTrafegoUpdateWithWhereUniqueWithoutDashboardInput = {
    where: CanalTrafegoWhereUniqueInput
    data: XOR<CanalTrafegoUpdateWithoutDashboardInput, CanalTrafegoUncheckedUpdateWithoutDashboardInput>
  }

  export type CanalTrafegoUpdateManyWithWhereWithoutDashboardInput = {
    where: CanalTrafegoScalarWhereInput
    data: XOR<CanalTrafegoUpdateManyMutationInput, CanalTrafegoUncheckedUpdateManyWithoutDashboardInput>
  }

  export type CanalTrafegoScalarWhereInput = {
    AND?: CanalTrafegoScalarWhereInput | CanalTrafegoScalarWhereInput[]
    OR?: CanalTrafegoScalarWhereInput[]
    NOT?: CanalTrafegoScalarWhereInput | CanalTrafegoScalarWhereInput[]
    id?: StringFilter<"CanalTrafego"> | string
    dashboardId?: StringFilter<"CanalTrafego"> | string
    canal?: StringFilter<"CanalTrafego"> | string
    taxaConversao?: FloatFilter<"CanalTrafego"> | number
    cpa?: DecimalFilter<"CanalTrafego"> | Decimal | DecimalJsLike | number | string
    roi?: FloatFilter<"CanalTrafego"> | number
  }

  export type OrganizationUpsertWithoutDashboardMarketingInput = {
    update: XOR<OrganizationUpdateWithoutDashboardMarketingInput, OrganizationUncheckedUpdateWithoutDashboardMarketingInput>
    create: XOR<OrganizationCreateWithoutDashboardMarketingInput, OrganizationUncheckedCreateWithoutDashboardMarketingInput>
    where?: OrganizationWhereInput
  }

  export type OrganizationUpdateToOneWithWhereWithoutDashboardMarketingInput = {
    where?: OrganizationWhereInput
    data: XOR<OrganizationUpdateWithoutDashboardMarketingInput, OrganizationUncheckedUpdateWithoutDashboardMarketingInput>
  }

  export type OrganizationUpdateWithoutDashboardMarketingInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    googleAccessToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleRefreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleScopes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    googleExpiresIn?: NullableFloatFieldUpdateOperationsInput | number | null
    dashboardComercial?: DashboardComercialUpdateOneWithoutOrganizationNestedInput
    users?: UserUpdateManyWithoutOrganizationNestedInput
  }

  export type OrganizationUncheckedUpdateWithoutDashboardMarketingInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    googleAccessToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleRefreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleScopes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    googleExpiresIn?: NullableFloatFieldUpdateOperationsInput | number | null
    dashboardComercial?: DashboardComercialUncheckedUpdateOneWithoutOrganizationNestedInput
    users?: UserUncheckedUpdateManyWithoutOrganizationNestedInput
  }

  export type PalavraChaveUpsertWithWhereUniqueWithoutDashboardInput = {
    where: PalavraChaveWhereUniqueInput
    update: XOR<PalavraChaveUpdateWithoutDashboardInput, PalavraChaveUncheckedUpdateWithoutDashboardInput>
    create: XOR<PalavraChaveCreateWithoutDashboardInput, PalavraChaveUncheckedCreateWithoutDashboardInput>
  }

  export type PalavraChaveUpdateWithWhereUniqueWithoutDashboardInput = {
    where: PalavraChaveWhereUniqueInput
    data: XOR<PalavraChaveUpdateWithoutDashboardInput, PalavraChaveUncheckedUpdateWithoutDashboardInput>
  }

  export type PalavraChaveUpdateManyWithWhereWithoutDashboardInput = {
    where: PalavraChaveScalarWhereInput
    data: XOR<PalavraChaveUpdateManyMutationInput, PalavraChaveUncheckedUpdateManyWithoutDashboardInput>
  }

  export type PalavraChaveScalarWhereInput = {
    AND?: PalavraChaveScalarWhereInput | PalavraChaveScalarWhereInput[]
    OR?: PalavraChaveScalarWhereInput[]
    NOT?: PalavraChaveScalarWhereInput | PalavraChaveScalarWhereInput[]
    id?: StringFilter<"PalavraChave"> | string
    dashboardId?: StringFilter<"PalavraChave"> | string
    palavra?: StringFilter<"PalavraChave"> | string
    ctr?: FloatFilter<"PalavraChave"> | number
  }

  export type TrafegoUpsertWithWhereUniqueWithoutDashboardInput = {
    where: TrafegoWhereUniqueInput
    update: XOR<TrafegoUpdateWithoutDashboardInput, TrafegoUncheckedUpdateWithoutDashboardInput>
    create: XOR<TrafegoCreateWithoutDashboardInput, TrafegoUncheckedCreateWithoutDashboardInput>
  }

  export type TrafegoUpdateWithWhereUniqueWithoutDashboardInput = {
    where: TrafegoWhereUniqueInput
    data: XOR<TrafegoUpdateWithoutDashboardInput, TrafegoUncheckedUpdateWithoutDashboardInput>
  }

  export type TrafegoUpdateManyWithWhereWithoutDashboardInput = {
    where: TrafegoScalarWhereInput
    data: XOR<TrafegoUpdateManyMutationInput, TrafegoUncheckedUpdateManyWithoutDashboardInput>
  }

  export type TrafegoScalarWhereInput = {
    AND?: TrafegoScalarWhereInput | TrafegoScalarWhereInput[]
    OR?: TrafegoScalarWhereInput[]
    NOT?: TrafegoScalarWhereInput | TrafegoScalarWhereInput[]
    id?: StringFilter<"Trafego"> | string
    dashboardId?: StringFilter<"Trafego"> | string
    origem?: StringFilter<"Trafego"> | string
    valor?: IntFilter<"Trafego"> | number
  }

  export type DashboardMarketingCreateWithoutTrafegoInput = {
    id?: string
    sessoes: number
    usuarios: number
    taxaRejeicao: number
    taxaConversaoSite: number
    taxaAbandonoCarrinho: number
    impressoes: number
    cliques: number
    ctr: number
    cpc: Decimal | DecimalJsLike | number | string
    conversoes: number
    custoPorConversao: Decimal | DecimalJsLike | number | string
    roas: number
    custoPorLead: Decimal | DecimalJsLike | number | string
    faturamentoTotal: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    anunciosCTR?: AnuncioCTRCreateNestedManyWithoutDashboardInput
    anunciosConv?: AnuncioConversaoCreateNestedManyWithoutDashboardInput
    canais?: CanalTrafegoCreateNestedManyWithoutDashboardInput
    organization: OrganizationCreateNestedOneWithoutDashboardMarketingInput
    palavrasChave?: PalavraChaveCreateNestedManyWithoutDashboardInput
  }

  export type DashboardMarketingUncheckedCreateWithoutTrafegoInput = {
    id?: string
    organizationId: string
    sessoes: number
    usuarios: number
    taxaRejeicao: number
    taxaConversaoSite: number
    taxaAbandonoCarrinho: number
    impressoes: number
    cliques: number
    ctr: number
    cpc: Decimal | DecimalJsLike | number | string
    conversoes: number
    custoPorConversao: Decimal | DecimalJsLike | number | string
    roas: number
    custoPorLead: Decimal | DecimalJsLike | number | string
    faturamentoTotal: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    anunciosCTR?: AnuncioCTRUncheckedCreateNestedManyWithoutDashboardInput
    anunciosConv?: AnuncioConversaoUncheckedCreateNestedManyWithoutDashboardInput
    canais?: CanalTrafegoUncheckedCreateNestedManyWithoutDashboardInput
    palavrasChave?: PalavraChaveUncheckedCreateNestedManyWithoutDashboardInput
  }

  export type DashboardMarketingCreateOrConnectWithoutTrafegoInput = {
    where: DashboardMarketingWhereUniqueInput
    create: XOR<DashboardMarketingCreateWithoutTrafegoInput, DashboardMarketingUncheckedCreateWithoutTrafegoInput>
  }

  export type DashboardMarketingUpsertWithoutTrafegoInput = {
    update: XOR<DashboardMarketingUpdateWithoutTrafegoInput, DashboardMarketingUncheckedUpdateWithoutTrafegoInput>
    create: XOR<DashboardMarketingCreateWithoutTrafegoInput, DashboardMarketingUncheckedCreateWithoutTrafegoInput>
    where?: DashboardMarketingWhereInput
  }

  export type DashboardMarketingUpdateToOneWithWhereWithoutTrafegoInput = {
    where?: DashboardMarketingWhereInput
    data: XOR<DashboardMarketingUpdateWithoutTrafegoInput, DashboardMarketingUncheckedUpdateWithoutTrafegoInput>
  }

  export type DashboardMarketingUpdateWithoutTrafegoInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessoes?: IntFieldUpdateOperationsInput | number
    usuarios?: IntFieldUpdateOperationsInput | number
    taxaRejeicao?: FloatFieldUpdateOperationsInput | number
    taxaConversaoSite?: FloatFieldUpdateOperationsInput | number
    taxaAbandonoCarrinho?: FloatFieldUpdateOperationsInput | number
    impressoes?: IntFieldUpdateOperationsInput | number
    cliques?: IntFieldUpdateOperationsInput | number
    ctr?: FloatFieldUpdateOperationsInput | number
    cpc?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    conversoes?: IntFieldUpdateOperationsInput | number
    custoPorConversao?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    roas?: FloatFieldUpdateOperationsInput | number
    custoPorLead?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    faturamentoTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    anunciosCTR?: AnuncioCTRUpdateManyWithoutDashboardNestedInput
    anunciosConv?: AnuncioConversaoUpdateManyWithoutDashboardNestedInput
    canais?: CanalTrafegoUpdateManyWithoutDashboardNestedInput
    organization?: OrganizationUpdateOneRequiredWithoutDashboardMarketingNestedInput
    palavrasChave?: PalavraChaveUpdateManyWithoutDashboardNestedInput
  }

  export type DashboardMarketingUncheckedUpdateWithoutTrafegoInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    sessoes?: IntFieldUpdateOperationsInput | number
    usuarios?: IntFieldUpdateOperationsInput | number
    taxaRejeicao?: FloatFieldUpdateOperationsInput | number
    taxaConversaoSite?: FloatFieldUpdateOperationsInput | number
    taxaAbandonoCarrinho?: FloatFieldUpdateOperationsInput | number
    impressoes?: IntFieldUpdateOperationsInput | number
    cliques?: IntFieldUpdateOperationsInput | number
    ctr?: FloatFieldUpdateOperationsInput | number
    cpc?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    conversoes?: IntFieldUpdateOperationsInput | number
    custoPorConversao?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    roas?: FloatFieldUpdateOperationsInput | number
    custoPorLead?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    faturamentoTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    anunciosCTR?: AnuncioCTRUncheckedUpdateManyWithoutDashboardNestedInput
    anunciosConv?: AnuncioConversaoUncheckedUpdateManyWithoutDashboardNestedInput
    canais?: CanalTrafegoUncheckedUpdateManyWithoutDashboardNestedInput
    palavrasChave?: PalavraChaveUncheckedUpdateManyWithoutDashboardNestedInput
  }

  export type DashboardMarketingCreateWithoutCanaisInput = {
    id?: string
    sessoes: number
    usuarios: number
    taxaRejeicao: number
    taxaConversaoSite: number
    taxaAbandonoCarrinho: number
    impressoes: number
    cliques: number
    ctr: number
    cpc: Decimal | DecimalJsLike | number | string
    conversoes: number
    custoPorConversao: Decimal | DecimalJsLike | number | string
    roas: number
    custoPorLead: Decimal | DecimalJsLike | number | string
    faturamentoTotal: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    anunciosCTR?: AnuncioCTRCreateNestedManyWithoutDashboardInput
    anunciosConv?: AnuncioConversaoCreateNestedManyWithoutDashboardInput
    organization: OrganizationCreateNestedOneWithoutDashboardMarketingInput
    palavrasChave?: PalavraChaveCreateNestedManyWithoutDashboardInput
    trafego?: TrafegoCreateNestedManyWithoutDashboardInput
  }

  export type DashboardMarketingUncheckedCreateWithoutCanaisInput = {
    id?: string
    organizationId: string
    sessoes: number
    usuarios: number
    taxaRejeicao: number
    taxaConversaoSite: number
    taxaAbandonoCarrinho: number
    impressoes: number
    cliques: number
    ctr: number
    cpc: Decimal | DecimalJsLike | number | string
    conversoes: number
    custoPorConversao: Decimal | DecimalJsLike | number | string
    roas: number
    custoPorLead: Decimal | DecimalJsLike | number | string
    faturamentoTotal: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    anunciosCTR?: AnuncioCTRUncheckedCreateNestedManyWithoutDashboardInput
    anunciosConv?: AnuncioConversaoUncheckedCreateNestedManyWithoutDashboardInput
    palavrasChave?: PalavraChaveUncheckedCreateNestedManyWithoutDashboardInput
    trafego?: TrafegoUncheckedCreateNestedManyWithoutDashboardInput
  }

  export type DashboardMarketingCreateOrConnectWithoutCanaisInput = {
    where: DashboardMarketingWhereUniqueInput
    create: XOR<DashboardMarketingCreateWithoutCanaisInput, DashboardMarketingUncheckedCreateWithoutCanaisInput>
  }

  export type DashboardMarketingUpsertWithoutCanaisInput = {
    update: XOR<DashboardMarketingUpdateWithoutCanaisInput, DashboardMarketingUncheckedUpdateWithoutCanaisInput>
    create: XOR<DashboardMarketingCreateWithoutCanaisInput, DashboardMarketingUncheckedCreateWithoutCanaisInput>
    where?: DashboardMarketingWhereInput
  }

  export type DashboardMarketingUpdateToOneWithWhereWithoutCanaisInput = {
    where?: DashboardMarketingWhereInput
    data: XOR<DashboardMarketingUpdateWithoutCanaisInput, DashboardMarketingUncheckedUpdateWithoutCanaisInput>
  }

  export type DashboardMarketingUpdateWithoutCanaisInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessoes?: IntFieldUpdateOperationsInput | number
    usuarios?: IntFieldUpdateOperationsInput | number
    taxaRejeicao?: FloatFieldUpdateOperationsInput | number
    taxaConversaoSite?: FloatFieldUpdateOperationsInput | number
    taxaAbandonoCarrinho?: FloatFieldUpdateOperationsInput | number
    impressoes?: IntFieldUpdateOperationsInput | number
    cliques?: IntFieldUpdateOperationsInput | number
    ctr?: FloatFieldUpdateOperationsInput | number
    cpc?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    conversoes?: IntFieldUpdateOperationsInput | number
    custoPorConversao?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    roas?: FloatFieldUpdateOperationsInput | number
    custoPorLead?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    faturamentoTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    anunciosCTR?: AnuncioCTRUpdateManyWithoutDashboardNestedInput
    anunciosConv?: AnuncioConversaoUpdateManyWithoutDashboardNestedInput
    organization?: OrganizationUpdateOneRequiredWithoutDashboardMarketingNestedInput
    palavrasChave?: PalavraChaveUpdateManyWithoutDashboardNestedInput
    trafego?: TrafegoUpdateManyWithoutDashboardNestedInput
  }

  export type DashboardMarketingUncheckedUpdateWithoutCanaisInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    sessoes?: IntFieldUpdateOperationsInput | number
    usuarios?: IntFieldUpdateOperationsInput | number
    taxaRejeicao?: FloatFieldUpdateOperationsInput | number
    taxaConversaoSite?: FloatFieldUpdateOperationsInput | number
    taxaAbandonoCarrinho?: FloatFieldUpdateOperationsInput | number
    impressoes?: IntFieldUpdateOperationsInput | number
    cliques?: IntFieldUpdateOperationsInput | number
    ctr?: FloatFieldUpdateOperationsInput | number
    cpc?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    conversoes?: IntFieldUpdateOperationsInput | number
    custoPorConversao?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    roas?: FloatFieldUpdateOperationsInput | number
    custoPorLead?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    faturamentoTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    anunciosCTR?: AnuncioCTRUncheckedUpdateManyWithoutDashboardNestedInput
    anunciosConv?: AnuncioConversaoUncheckedUpdateManyWithoutDashboardNestedInput
    palavrasChave?: PalavraChaveUncheckedUpdateManyWithoutDashboardNestedInput
    trafego?: TrafegoUncheckedUpdateManyWithoutDashboardNestedInput
  }

  export type DashboardMarketingCreateWithoutAnunciosCTRInput = {
    id?: string
    sessoes: number
    usuarios: number
    taxaRejeicao: number
    taxaConversaoSite: number
    taxaAbandonoCarrinho: number
    impressoes: number
    cliques: number
    ctr: number
    cpc: Decimal | DecimalJsLike | number | string
    conversoes: number
    custoPorConversao: Decimal | DecimalJsLike | number | string
    roas: number
    custoPorLead: Decimal | DecimalJsLike | number | string
    faturamentoTotal: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    anunciosConv?: AnuncioConversaoCreateNestedManyWithoutDashboardInput
    canais?: CanalTrafegoCreateNestedManyWithoutDashboardInput
    organization: OrganizationCreateNestedOneWithoutDashboardMarketingInput
    palavrasChave?: PalavraChaveCreateNestedManyWithoutDashboardInput
    trafego?: TrafegoCreateNestedManyWithoutDashboardInput
  }

  export type DashboardMarketingUncheckedCreateWithoutAnunciosCTRInput = {
    id?: string
    organizationId: string
    sessoes: number
    usuarios: number
    taxaRejeicao: number
    taxaConversaoSite: number
    taxaAbandonoCarrinho: number
    impressoes: number
    cliques: number
    ctr: number
    cpc: Decimal | DecimalJsLike | number | string
    conversoes: number
    custoPorConversao: Decimal | DecimalJsLike | number | string
    roas: number
    custoPorLead: Decimal | DecimalJsLike | number | string
    faturamentoTotal: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    anunciosConv?: AnuncioConversaoUncheckedCreateNestedManyWithoutDashboardInput
    canais?: CanalTrafegoUncheckedCreateNestedManyWithoutDashboardInput
    palavrasChave?: PalavraChaveUncheckedCreateNestedManyWithoutDashboardInput
    trafego?: TrafegoUncheckedCreateNestedManyWithoutDashboardInput
  }

  export type DashboardMarketingCreateOrConnectWithoutAnunciosCTRInput = {
    where: DashboardMarketingWhereUniqueInput
    create: XOR<DashboardMarketingCreateWithoutAnunciosCTRInput, DashboardMarketingUncheckedCreateWithoutAnunciosCTRInput>
  }

  export type DashboardMarketingUpsertWithoutAnunciosCTRInput = {
    update: XOR<DashboardMarketingUpdateWithoutAnunciosCTRInput, DashboardMarketingUncheckedUpdateWithoutAnunciosCTRInput>
    create: XOR<DashboardMarketingCreateWithoutAnunciosCTRInput, DashboardMarketingUncheckedCreateWithoutAnunciosCTRInput>
    where?: DashboardMarketingWhereInput
  }

  export type DashboardMarketingUpdateToOneWithWhereWithoutAnunciosCTRInput = {
    where?: DashboardMarketingWhereInput
    data: XOR<DashboardMarketingUpdateWithoutAnunciosCTRInput, DashboardMarketingUncheckedUpdateWithoutAnunciosCTRInput>
  }

  export type DashboardMarketingUpdateWithoutAnunciosCTRInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessoes?: IntFieldUpdateOperationsInput | number
    usuarios?: IntFieldUpdateOperationsInput | number
    taxaRejeicao?: FloatFieldUpdateOperationsInput | number
    taxaConversaoSite?: FloatFieldUpdateOperationsInput | number
    taxaAbandonoCarrinho?: FloatFieldUpdateOperationsInput | number
    impressoes?: IntFieldUpdateOperationsInput | number
    cliques?: IntFieldUpdateOperationsInput | number
    ctr?: FloatFieldUpdateOperationsInput | number
    cpc?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    conversoes?: IntFieldUpdateOperationsInput | number
    custoPorConversao?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    roas?: FloatFieldUpdateOperationsInput | number
    custoPorLead?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    faturamentoTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    anunciosConv?: AnuncioConversaoUpdateManyWithoutDashboardNestedInput
    canais?: CanalTrafegoUpdateManyWithoutDashboardNestedInput
    organization?: OrganizationUpdateOneRequiredWithoutDashboardMarketingNestedInput
    palavrasChave?: PalavraChaveUpdateManyWithoutDashboardNestedInput
    trafego?: TrafegoUpdateManyWithoutDashboardNestedInput
  }

  export type DashboardMarketingUncheckedUpdateWithoutAnunciosCTRInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    sessoes?: IntFieldUpdateOperationsInput | number
    usuarios?: IntFieldUpdateOperationsInput | number
    taxaRejeicao?: FloatFieldUpdateOperationsInput | number
    taxaConversaoSite?: FloatFieldUpdateOperationsInput | number
    taxaAbandonoCarrinho?: FloatFieldUpdateOperationsInput | number
    impressoes?: IntFieldUpdateOperationsInput | number
    cliques?: IntFieldUpdateOperationsInput | number
    ctr?: FloatFieldUpdateOperationsInput | number
    cpc?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    conversoes?: IntFieldUpdateOperationsInput | number
    custoPorConversao?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    roas?: FloatFieldUpdateOperationsInput | number
    custoPorLead?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    faturamentoTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    anunciosConv?: AnuncioConversaoUncheckedUpdateManyWithoutDashboardNestedInput
    canais?: CanalTrafegoUncheckedUpdateManyWithoutDashboardNestedInput
    palavrasChave?: PalavraChaveUncheckedUpdateManyWithoutDashboardNestedInput
    trafego?: TrafegoUncheckedUpdateManyWithoutDashboardNestedInput
  }

  export type DashboardMarketingCreateWithoutAnunciosConvInput = {
    id?: string
    sessoes: number
    usuarios: number
    taxaRejeicao: number
    taxaConversaoSite: number
    taxaAbandonoCarrinho: number
    impressoes: number
    cliques: number
    ctr: number
    cpc: Decimal | DecimalJsLike | number | string
    conversoes: number
    custoPorConversao: Decimal | DecimalJsLike | number | string
    roas: number
    custoPorLead: Decimal | DecimalJsLike | number | string
    faturamentoTotal: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    anunciosCTR?: AnuncioCTRCreateNestedManyWithoutDashboardInput
    canais?: CanalTrafegoCreateNestedManyWithoutDashboardInput
    organization: OrganizationCreateNestedOneWithoutDashboardMarketingInput
    palavrasChave?: PalavraChaveCreateNestedManyWithoutDashboardInput
    trafego?: TrafegoCreateNestedManyWithoutDashboardInput
  }

  export type DashboardMarketingUncheckedCreateWithoutAnunciosConvInput = {
    id?: string
    organizationId: string
    sessoes: number
    usuarios: number
    taxaRejeicao: number
    taxaConversaoSite: number
    taxaAbandonoCarrinho: number
    impressoes: number
    cliques: number
    ctr: number
    cpc: Decimal | DecimalJsLike | number | string
    conversoes: number
    custoPorConversao: Decimal | DecimalJsLike | number | string
    roas: number
    custoPorLead: Decimal | DecimalJsLike | number | string
    faturamentoTotal: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    anunciosCTR?: AnuncioCTRUncheckedCreateNestedManyWithoutDashboardInput
    canais?: CanalTrafegoUncheckedCreateNestedManyWithoutDashboardInput
    palavrasChave?: PalavraChaveUncheckedCreateNestedManyWithoutDashboardInput
    trafego?: TrafegoUncheckedCreateNestedManyWithoutDashboardInput
  }

  export type DashboardMarketingCreateOrConnectWithoutAnunciosConvInput = {
    where: DashboardMarketingWhereUniqueInput
    create: XOR<DashboardMarketingCreateWithoutAnunciosConvInput, DashboardMarketingUncheckedCreateWithoutAnunciosConvInput>
  }

  export type DashboardMarketingUpsertWithoutAnunciosConvInput = {
    update: XOR<DashboardMarketingUpdateWithoutAnunciosConvInput, DashboardMarketingUncheckedUpdateWithoutAnunciosConvInput>
    create: XOR<DashboardMarketingCreateWithoutAnunciosConvInput, DashboardMarketingUncheckedCreateWithoutAnunciosConvInput>
    where?: DashboardMarketingWhereInput
  }

  export type DashboardMarketingUpdateToOneWithWhereWithoutAnunciosConvInput = {
    where?: DashboardMarketingWhereInput
    data: XOR<DashboardMarketingUpdateWithoutAnunciosConvInput, DashboardMarketingUncheckedUpdateWithoutAnunciosConvInput>
  }

  export type DashboardMarketingUpdateWithoutAnunciosConvInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessoes?: IntFieldUpdateOperationsInput | number
    usuarios?: IntFieldUpdateOperationsInput | number
    taxaRejeicao?: FloatFieldUpdateOperationsInput | number
    taxaConversaoSite?: FloatFieldUpdateOperationsInput | number
    taxaAbandonoCarrinho?: FloatFieldUpdateOperationsInput | number
    impressoes?: IntFieldUpdateOperationsInput | number
    cliques?: IntFieldUpdateOperationsInput | number
    ctr?: FloatFieldUpdateOperationsInput | number
    cpc?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    conversoes?: IntFieldUpdateOperationsInput | number
    custoPorConversao?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    roas?: FloatFieldUpdateOperationsInput | number
    custoPorLead?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    faturamentoTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    anunciosCTR?: AnuncioCTRUpdateManyWithoutDashboardNestedInput
    canais?: CanalTrafegoUpdateManyWithoutDashboardNestedInput
    organization?: OrganizationUpdateOneRequiredWithoutDashboardMarketingNestedInput
    palavrasChave?: PalavraChaveUpdateManyWithoutDashboardNestedInput
    trafego?: TrafegoUpdateManyWithoutDashboardNestedInput
  }

  export type DashboardMarketingUncheckedUpdateWithoutAnunciosConvInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    sessoes?: IntFieldUpdateOperationsInput | number
    usuarios?: IntFieldUpdateOperationsInput | number
    taxaRejeicao?: FloatFieldUpdateOperationsInput | number
    taxaConversaoSite?: FloatFieldUpdateOperationsInput | number
    taxaAbandonoCarrinho?: FloatFieldUpdateOperationsInput | number
    impressoes?: IntFieldUpdateOperationsInput | number
    cliques?: IntFieldUpdateOperationsInput | number
    ctr?: FloatFieldUpdateOperationsInput | number
    cpc?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    conversoes?: IntFieldUpdateOperationsInput | number
    custoPorConversao?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    roas?: FloatFieldUpdateOperationsInput | number
    custoPorLead?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    faturamentoTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    anunciosCTR?: AnuncioCTRUncheckedUpdateManyWithoutDashboardNestedInput
    canais?: CanalTrafegoUncheckedUpdateManyWithoutDashboardNestedInput
    palavrasChave?: PalavraChaveUncheckedUpdateManyWithoutDashboardNestedInput
    trafego?: TrafegoUncheckedUpdateManyWithoutDashboardNestedInput
  }

  export type DashboardMarketingCreateWithoutPalavrasChaveInput = {
    id?: string
    sessoes: number
    usuarios: number
    taxaRejeicao: number
    taxaConversaoSite: number
    taxaAbandonoCarrinho: number
    impressoes: number
    cliques: number
    ctr: number
    cpc: Decimal | DecimalJsLike | number | string
    conversoes: number
    custoPorConversao: Decimal | DecimalJsLike | number | string
    roas: number
    custoPorLead: Decimal | DecimalJsLike | number | string
    faturamentoTotal: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    anunciosCTR?: AnuncioCTRCreateNestedManyWithoutDashboardInput
    anunciosConv?: AnuncioConversaoCreateNestedManyWithoutDashboardInput
    canais?: CanalTrafegoCreateNestedManyWithoutDashboardInput
    organization: OrganizationCreateNestedOneWithoutDashboardMarketingInput
    trafego?: TrafegoCreateNestedManyWithoutDashboardInput
  }

  export type DashboardMarketingUncheckedCreateWithoutPalavrasChaveInput = {
    id?: string
    organizationId: string
    sessoes: number
    usuarios: number
    taxaRejeicao: number
    taxaConversaoSite: number
    taxaAbandonoCarrinho: number
    impressoes: number
    cliques: number
    ctr: number
    cpc: Decimal | DecimalJsLike | number | string
    conversoes: number
    custoPorConversao: Decimal | DecimalJsLike | number | string
    roas: number
    custoPorLead: Decimal | DecimalJsLike | number | string
    faturamentoTotal: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    anunciosCTR?: AnuncioCTRUncheckedCreateNestedManyWithoutDashboardInput
    anunciosConv?: AnuncioConversaoUncheckedCreateNestedManyWithoutDashboardInput
    canais?: CanalTrafegoUncheckedCreateNestedManyWithoutDashboardInput
    trafego?: TrafegoUncheckedCreateNestedManyWithoutDashboardInput
  }

  export type DashboardMarketingCreateOrConnectWithoutPalavrasChaveInput = {
    where: DashboardMarketingWhereUniqueInput
    create: XOR<DashboardMarketingCreateWithoutPalavrasChaveInput, DashboardMarketingUncheckedCreateWithoutPalavrasChaveInput>
  }

  export type DashboardMarketingUpsertWithoutPalavrasChaveInput = {
    update: XOR<DashboardMarketingUpdateWithoutPalavrasChaveInput, DashboardMarketingUncheckedUpdateWithoutPalavrasChaveInput>
    create: XOR<DashboardMarketingCreateWithoutPalavrasChaveInput, DashboardMarketingUncheckedCreateWithoutPalavrasChaveInput>
    where?: DashboardMarketingWhereInput
  }

  export type DashboardMarketingUpdateToOneWithWhereWithoutPalavrasChaveInput = {
    where?: DashboardMarketingWhereInput
    data: XOR<DashboardMarketingUpdateWithoutPalavrasChaveInput, DashboardMarketingUncheckedUpdateWithoutPalavrasChaveInput>
  }

  export type DashboardMarketingUpdateWithoutPalavrasChaveInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessoes?: IntFieldUpdateOperationsInput | number
    usuarios?: IntFieldUpdateOperationsInput | number
    taxaRejeicao?: FloatFieldUpdateOperationsInput | number
    taxaConversaoSite?: FloatFieldUpdateOperationsInput | number
    taxaAbandonoCarrinho?: FloatFieldUpdateOperationsInput | number
    impressoes?: IntFieldUpdateOperationsInput | number
    cliques?: IntFieldUpdateOperationsInput | number
    ctr?: FloatFieldUpdateOperationsInput | number
    cpc?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    conversoes?: IntFieldUpdateOperationsInput | number
    custoPorConversao?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    roas?: FloatFieldUpdateOperationsInput | number
    custoPorLead?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    faturamentoTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    anunciosCTR?: AnuncioCTRUpdateManyWithoutDashboardNestedInput
    anunciosConv?: AnuncioConversaoUpdateManyWithoutDashboardNestedInput
    canais?: CanalTrafegoUpdateManyWithoutDashboardNestedInput
    organization?: OrganizationUpdateOneRequiredWithoutDashboardMarketingNestedInput
    trafego?: TrafegoUpdateManyWithoutDashboardNestedInput
  }

  export type DashboardMarketingUncheckedUpdateWithoutPalavrasChaveInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    sessoes?: IntFieldUpdateOperationsInput | number
    usuarios?: IntFieldUpdateOperationsInput | number
    taxaRejeicao?: FloatFieldUpdateOperationsInput | number
    taxaConversaoSite?: FloatFieldUpdateOperationsInput | number
    taxaAbandonoCarrinho?: FloatFieldUpdateOperationsInput | number
    impressoes?: IntFieldUpdateOperationsInput | number
    cliques?: IntFieldUpdateOperationsInput | number
    ctr?: FloatFieldUpdateOperationsInput | number
    cpc?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    conversoes?: IntFieldUpdateOperationsInput | number
    custoPorConversao?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    roas?: FloatFieldUpdateOperationsInput | number
    custoPorLead?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    faturamentoTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    anunciosCTR?: AnuncioCTRUncheckedUpdateManyWithoutDashboardNestedInput
    anunciosConv?: AnuncioConversaoUncheckedUpdateManyWithoutDashboardNestedInput
    canais?: CanalTrafegoUncheckedUpdateManyWithoutDashboardNestedInput
    trafego?: TrafegoUncheckedUpdateManyWithoutDashboardNestedInput
  }

  export type ClientesRecorrentesVsUnicosCreateWithoutDashboardInput = {
    id?: string
    tipoCliente: string
    quantidade: number
  }

  export type ClientesRecorrentesVsUnicosUncheckedCreateWithoutDashboardInput = {
    id?: string
    tipoCliente: string
    quantidade: number
  }

  export type ClientesRecorrentesVsUnicosCreateOrConnectWithoutDashboardInput = {
    where: ClientesRecorrentesVsUnicosWhereUniqueInput
    create: XOR<ClientesRecorrentesVsUnicosCreateWithoutDashboardInput, ClientesRecorrentesVsUnicosUncheckedCreateWithoutDashboardInput>
  }

  export type ClientesRecorrentesVsUnicosCreateManyDashboardInputEnvelope = {
    data: ClientesRecorrentesVsUnicosCreateManyDashboardInput | ClientesRecorrentesVsUnicosCreateManyDashboardInput[]
    skipDuplicates?: boolean
  }

  export type OrganizationCreateWithoutDashboardComercialInput = {
    id?: string
    name: string
    googleAccessToken?: string | null
    googleRefreshToken?: string | null
    googleScopes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    googleExpiresIn?: number | null
    dashboardMarketing?: DashboardMarketingCreateNestedOneWithoutOrganizationInput
    users?: UserCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationUncheckedCreateWithoutDashboardComercialInput = {
    id?: string
    name: string
    googleAccessToken?: string | null
    googleRefreshToken?: string | null
    googleScopes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    googleExpiresIn?: number | null
    dashboardMarketing?: DashboardMarketingUncheckedCreateNestedOneWithoutOrganizationInput
    users?: UserUncheckedCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationCreateOrConnectWithoutDashboardComercialInput = {
    where: OrganizationWhereUniqueInput
    create: XOR<OrganizationCreateWithoutDashboardComercialInput, OrganizationUncheckedCreateWithoutDashboardComercialInput>
  }

  export type ProdutoRankCreateWithoutDashboardInput = {
    id?: string
    produto: string
    vendas: number
  }

  export type ProdutoRankUncheckedCreateWithoutDashboardInput = {
    id?: string
    produto: string
    vendas: number
  }

  export type ProdutoRankCreateOrConnectWithoutDashboardInput = {
    where: ProdutoRankWhereUniqueInput
    create: XOR<ProdutoRankCreateWithoutDashboardInput, ProdutoRankUncheckedCreateWithoutDashboardInput>
  }

  export type ProdutoRankCreateManyDashboardInputEnvelope = {
    data: ProdutoRankCreateManyDashboardInput | ProdutoRankCreateManyDashboardInput[]
    skipDuplicates?: boolean
  }

  export type ReceitaCategoriaCreateWithoutDashboardInput = {
    id?: string
    categoria: string
    receita: Decimal | DecimalJsLike | number | string
  }

  export type ReceitaCategoriaUncheckedCreateWithoutDashboardInput = {
    id?: string
    categoria: string
    receita: Decimal | DecimalJsLike | number | string
  }

  export type ReceitaCategoriaCreateOrConnectWithoutDashboardInput = {
    where: ReceitaCategoriaWhereUniqueInput
    create: XOR<ReceitaCategoriaCreateWithoutDashboardInput, ReceitaCategoriaUncheckedCreateWithoutDashboardInput>
  }

  export type ReceitaCategoriaCreateManyDashboardInputEnvelope = {
    data: ReceitaCategoriaCreateManyDashboardInput | ReceitaCategoriaCreateManyDashboardInput[]
    skipDuplicates?: boolean
  }

  export type ReceitaMetodoPagamentoCreateWithoutDashboardInput = {
    id?: string
    metodoPagamento: string
    receita: Decimal | DecimalJsLike | number | string
  }

  export type ReceitaMetodoPagamentoUncheckedCreateWithoutDashboardInput = {
    id?: string
    metodoPagamento: string
    receita: Decimal | DecimalJsLike | number | string
  }

  export type ReceitaMetodoPagamentoCreateOrConnectWithoutDashboardInput = {
    where: ReceitaMetodoPagamentoWhereUniqueInput
    create: XOR<ReceitaMetodoPagamentoCreateWithoutDashboardInput, ReceitaMetodoPagamentoUncheckedCreateWithoutDashboardInput>
  }

  export type ReceitaMetodoPagamentoCreateManyDashboardInputEnvelope = {
    data: ReceitaMetodoPagamentoCreateManyDashboardInput | ReceitaMetodoPagamentoCreateManyDashboardInput[]
    skipDuplicates?: boolean
  }

  export type ClientesRecorrentesVsUnicosUpsertWithWhereUniqueWithoutDashboardInput = {
    where: ClientesRecorrentesVsUnicosWhereUniqueInput
    update: XOR<ClientesRecorrentesVsUnicosUpdateWithoutDashboardInput, ClientesRecorrentesVsUnicosUncheckedUpdateWithoutDashboardInput>
    create: XOR<ClientesRecorrentesVsUnicosCreateWithoutDashboardInput, ClientesRecorrentesVsUnicosUncheckedCreateWithoutDashboardInput>
  }

  export type ClientesRecorrentesVsUnicosUpdateWithWhereUniqueWithoutDashboardInput = {
    where: ClientesRecorrentesVsUnicosWhereUniqueInput
    data: XOR<ClientesRecorrentesVsUnicosUpdateWithoutDashboardInput, ClientesRecorrentesVsUnicosUncheckedUpdateWithoutDashboardInput>
  }

  export type ClientesRecorrentesVsUnicosUpdateManyWithWhereWithoutDashboardInput = {
    where: ClientesRecorrentesVsUnicosScalarWhereInput
    data: XOR<ClientesRecorrentesVsUnicosUpdateManyMutationInput, ClientesRecorrentesVsUnicosUncheckedUpdateManyWithoutDashboardInput>
  }

  export type ClientesRecorrentesVsUnicosScalarWhereInput = {
    AND?: ClientesRecorrentesVsUnicosScalarWhereInput | ClientesRecorrentesVsUnicosScalarWhereInput[]
    OR?: ClientesRecorrentesVsUnicosScalarWhereInput[]
    NOT?: ClientesRecorrentesVsUnicosScalarWhereInput | ClientesRecorrentesVsUnicosScalarWhereInput[]
    id?: StringFilter<"ClientesRecorrentesVsUnicos"> | string
    dashboardId?: StringFilter<"ClientesRecorrentesVsUnicos"> | string
    tipoCliente?: StringFilter<"ClientesRecorrentesVsUnicos"> | string
    quantidade?: IntFilter<"ClientesRecorrentesVsUnicos"> | number
  }

  export type OrganizationUpsertWithoutDashboardComercialInput = {
    update: XOR<OrganizationUpdateWithoutDashboardComercialInput, OrganizationUncheckedUpdateWithoutDashboardComercialInput>
    create: XOR<OrganizationCreateWithoutDashboardComercialInput, OrganizationUncheckedCreateWithoutDashboardComercialInput>
    where?: OrganizationWhereInput
  }

  export type OrganizationUpdateToOneWithWhereWithoutDashboardComercialInput = {
    where?: OrganizationWhereInput
    data: XOR<OrganizationUpdateWithoutDashboardComercialInput, OrganizationUncheckedUpdateWithoutDashboardComercialInput>
  }

  export type OrganizationUpdateWithoutDashboardComercialInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    googleAccessToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleRefreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleScopes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    googleExpiresIn?: NullableFloatFieldUpdateOperationsInput | number | null
    dashboardMarketing?: DashboardMarketingUpdateOneWithoutOrganizationNestedInput
    users?: UserUpdateManyWithoutOrganizationNestedInput
  }

  export type OrganizationUncheckedUpdateWithoutDashboardComercialInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    googleAccessToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleRefreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleScopes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    googleExpiresIn?: NullableFloatFieldUpdateOperationsInput | number | null
    dashboardMarketing?: DashboardMarketingUncheckedUpdateOneWithoutOrganizationNestedInput
    users?: UserUncheckedUpdateManyWithoutOrganizationNestedInput
  }

  export type ProdutoRankUpsertWithWhereUniqueWithoutDashboardInput = {
    where: ProdutoRankWhereUniqueInput
    update: XOR<ProdutoRankUpdateWithoutDashboardInput, ProdutoRankUncheckedUpdateWithoutDashboardInput>
    create: XOR<ProdutoRankCreateWithoutDashboardInput, ProdutoRankUncheckedCreateWithoutDashboardInput>
  }

  export type ProdutoRankUpdateWithWhereUniqueWithoutDashboardInput = {
    where: ProdutoRankWhereUniqueInput
    data: XOR<ProdutoRankUpdateWithoutDashboardInput, ProdutoRankUncheckedUpdateWithoutDashboardInput>
  }

  export type ProdutoRankUpdateManyWithWhereWithoutDashboardInput = {
    where: ProdutoRankScalarWhereInput
    data: XOR<ProdutoRankUpdateManyMutationInput, ProdutoRankUncheckedUpdateManyWithoutDashboardInput>
  }

  export type ProdutoRankScalarWhereInput = {
    AND?: ProdutoRankScalarWhereInput | ProdutoRankScalarWhereInput[]
    OR?: ProdutoRankScalarWhereInput[]
    NOT?: ProdutoRankScalarWhereInput | ProdutoRankScalarWhereInput[]
    id?: StringFilter<"ProdutoRank"> | string
    dashboardId?: StringFilter<"ProdutoRank"> | string
    produto?: StringFilter<"ProdutoRank"> | string
    vendas?: IntFilter<"ProdutoRank"> | number
  }

  export type ReceitaCategoriaUpsertWithWhereUniqueWithoutDashboardInput = {
    where: ReceitaCategoriaWhereUniqueInput
    update: XOR<ReceitaCategoriaUpdateWithoutDashboardInput, ReceitaCategoriaUncheckedUpdateWithoutDashboardInput>
    create: XOR<ReceitaCategoriaCreateWithoutDashboardInput, ReceitaCategoriaUncheckedCreateWithoutDashboardInput>
  }

  export type ReceitaCategoriaUpdateWithWhereUniqueWithoutDashboardInput = {
    where: ReceitaCategoriaWhereUniqueInput
    data: XOR<ReceitaCategoriaUpdateWithoutDashboardInput, ReceitaCategoriaUncheckedUpdateWithoutDashboardInput>
  }

  export type ReceitaCategoriaUpdateManyWithWhereWithoutDashboardInput = {
    where: ReceitaCategoriaScalarWhereInput
    data: XOR<ReceitaCategoriaUpdateManyMutationInput, ReceitaCategoriaUncheckedUpdateManyWithoutDashboardInput>
  }

  export type ReceitaCategoriaScalarWhereInput = {
    AND?: ReceitaCategoriaScalarWhereInput | ReceitaCategoriaScalarWhereInput[]
    OR?: ReceitaCategoriaScalarWhereInput[]
    NOT?: ReceitaCategoriaScalarWhereInput | ReceitaCategoriaScalarWhereInput[]
    id?: StringFilter<"ReceitaCategoria"> | string
    dashboardId?: StringFilter<"ReceitaCategoria"> | string
    categoria?: StringFilter<"ReceitaCategoria"> | string
    receita?: DecimalFilter<"ReceitaCategoria"> | Decimal | DecimalJsLike | number | string
  }

  export type ReceitaMetodoPagamentoUpsertWithWhereUniqueWithoutDashboardInput = {
    where: ReceitaMetodoPagamentoWhereUniqueInput
    update: XOR<ReceitaMetodoPagamentoUpdateWithoutDashboardInput, ReceitaMetodoPagamentoUncheckedUpdateWithoutDashboardInput>
    create: XOR<ReceitaMetodoPagamentoCreateWithoutDashboardInput, ReceitaMetodoPagamentoUncheckedCreateWithoutDashboardInput>
  }

  export type ReceitaMetodoPagamentoUpdateWithWhereUniqueWithoutDashboardInput = {
    where: ReceitaMetodoPagamentoWhereUniqueInput
    data: XOR<ReceitaMetodoPagamentoUpdateWithoutDashboardInput, ReceitaMetodoPagamentoUncheckedUpdateWithoutDashboardInput>
  }

  export type ReceitaMetodoPagamentoUpdateManyWithWhereWithoutDashboardInput = {
    where: ReceitaMetodoPagamentoScalarWhereInput
    data: XOR<ReceitaMetodoPagamentoUpdateManyMutationInput, ReceitaMetodoPagamentoUncheckedUpdateManyWithoutDashboardInput>
  }

  export type ReceitaMetodoPagamentoScalarWhereInput = {
    AND?: ReceitaMetodoPagamentoScalarWhereInput | ReceitaMetodoPagamentoScalarWhereInput[]
    OR?: ReceitaMetodoPagamentoScalarWhereInput[]
    NOT?: ReceitaMetodoPagamentoScalarWhereInput | ReceitaMetodoPagamentoScalarWhereInput[]
    id?: StringFilter<"ReceitaMetodoPagamento"> | string
    dashboardId?: StringFilter<"ReceitaMetodoPagamento"> | string
    metodoPagamento?: StringFilter<"ReceitaMetodoPagamento"> | string
    receita?: DecimalFilter<"ReceitaMetodoPagamento"> | Decimal | DecimalJsLike | number | string
  }

  export type DashboardComercialCreateWithoutReceitaPorCategoriaInput = {
    id?: string
    receitaTotal: Decimal | DecimalJsLike | number | string
    ticketMedio: Decimal | DecimalJsLike | number | string
    crescimentoReceita: number
    novosClientes: number
    taxaRetencaoClientes: number
    clv: Decimal | DecimalJsLike | number | string
    volumeReparos: number
    taxaReincidenciaReparos: number
    receitaReparosVsVendas: number
    createdAt?: Date | string
    updatedAt?: Date | string
    clientesComparacao?: ClientesRecorrentesVsUnicosCreateNestedManyWithoutDashboardInput
    organization: OrganizationCreateNestedOneWithoutDashboardComercialInput
    produtosTop?: ProdutoRankCreateNestedManyWithoutDashboardInput
    receitaPorPagamento?: ReceitaMetodoPagamentoCreateNestedManyWithoutDashboardInput
  }

  export type DashboardComercialUncheckedCreateWithoutReceitaPorCategoriaInput = {
    id?: string
    organizationId: string
    receitaTotal: Decimal | DecimalJsLike | number | string
    ticketMedio: Decimal | DecimalJsLike | number | string
    crescimentoReceita: number
    novosClientes: number
    taxaRetencaoClientes: number
    clv: Decimal | DecimalJsLike | number | string
    volumeReparos: number
    taxaReincidenciaReparos: number
    receitaReparosVsVendas: number
    createdAt?: Date | string
    updatedAt?: Date | string
    clientesComparacao?: ClientesRecorrentesVsUnicosUncheckedCreateNestedManyWithoutDashboardInput
    produtosTop?: ProdutoRankUncheckedCreateNestedManyWithoutDashboardInput
    receitaPorPagamento?: ReceitaMetodoPagamentoUncheckedCreateNestedManyWithoutDashboardInput
  }

  export type DashboardComercialCreateOrConnectWithoutReceitaPorCategoriaInput = {
    where: DashboardComercialWhereUniqueInput
    create: XOR<DashboardComercialCreateWithoutReceitaPorCategoriaInput, DashboardComercialUncheckedCreateWithoutReceitaPorCategoriaInput>
  }

  export type DashboardComercialUpsertWithoutReceitaPorCategoriaInput = {
    update: XOR<DashboardComercialUpdateWithoutReceitaPorCategoriaInput, DashboardComercialUncheckedUpdateWithoutReceitaPorCategoriaInput>
    create: XOR<DashboardComercialCreateWithoutReceitaPorCategoriaInput, DashboardComercialUncheckedCreateWithoutReceitaPorCategoriaInput>
    where?: DashboardComercialWhereInput
  }

  export type DashboardComercialUpdateToOneWithWhereWithoutReceitaPorCategoriaInput = {
    where?: DashboardComercialWhereInput
    data: XOR<DashboardComercialUpdateWithoutReceitaPorCategoriaInput, DashboardComercialUncheckedUpdateWithoutReceitaPorCategoriaInput>
  }

  export type DashboardComercialUpdateWithoutReceitaPorCategoriaInput = {
    id?: StringFieldUpdateOperationsInput | string
    receitaTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ticketMedio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    crescimentoReceita?: FloatFieldUpdateOperationsInput | number
    novosClientes?: IntFieldUpdateOperationsInput | number
    taxaRetencaoClientes?: FloatFieldUpdateOperationsInput | number
    clv?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    volumeReparos?: IntFieldUpdateOperationsInput | number
    taxaReincidenciaReparos?: FloatFieldUpdateOperationsInput | number
    receitaReparosVsVendas?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clientesComparacao?: ClientesRecorrentesVsUnicosUpdateManyWithoutDashboardNestedInput
    organization?: OrganizationUpdateOneRequiredWithoutDashboardComercialNestedInput
    produtosTop?: ProdutoRankUpdateManyWithoutDashboardNestedInput
    receitaPorPagamento?: ReceitaMetodoPagamentoUpdateManyWithoutDashboardNestedInput
  }

  export type DashboardComercialUncheckedUpdateWithoutReceitaPorCategoriaInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    receitaTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ticketMedio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    crescimentoReceita?: FloatFieldUpdateOperationsInput | number
    novosClientes?: IntFieldUpdateOperationsInput | number
    taxaRetencaoClientes?: FloatFieldUpdateOperationsInput | number
    clv?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    volumeReparos?: IntFieldUpdateOperationsInput | number
    taxaReincidenciaReparos?: FloatFieldUpdateOperationsInput | number
    receitaReparosVsVendas?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clientesComparacao?: ClientesRecorrentesVsUnicosUncheckedUpdateManyWithoutDashboardNestedInput
    produtosTop?: ProdutoRankUncheckedUpdateManyWithoutDashboardNestedInput
    receitaPorPagamento?: ReceitaMetodoPagamentoUncheckedUpdateManyWithoutDashboardNestedInput
  }

  export type DashboardComercialCreateWithoutReceitaPorPagamentoInput = {
    id?: string
    receitaTotal: Decimal | DecimalJsLike | number | string
    ticketMedio: Decimal | DecimalJsLike | number | string
    crescimentoReceita: number
    novosClientes: number
    taxaRetencaoClientes: number
    clv: Decimal | DecimalJsLike | number | string
    volumeReparos: number
    taxaReincidenciaReparos: number
    receitaReparosVsVendas: number
    createdAt?: Date | string
    updatedAt?: Date | string
    clientesComparacao?: ClientesRecorrentesVsUnicosCreateNestedManyWithoutDashboardInput
    organization: OrganizationCreateNestedOneWithoutDashboardComercialInput
    produtosTop?: ProdutoRankCreateNestedManyWithoutDashboardInput
    receitaPorCategoria?: ReceitaCategoriaCreateNestedManyWithoutDashboardInput
  }

  export type DashboardComercialUncheckedCreateWithoutReceitaPorPagamentoInput = {
    id?: string
    organizationId: string
    receitaTotal: Decimal | DecimalJsLike | number | string
    ticketMedio: Decimal | DecimalJsLike | number | string
    crescimentoReceita: number
    novosClientes: number
    taxaRetencaoClientes: number
    clv: Decimal | DecimalJsLike | number | string
    volumeReparos: number
    taxaReincidenciaReparos: number
    receitaReparosVsVendas: number
    createdAt?: Date | string
    updatedAt?: Date | string
    clientesComparacao?: ClientesRecorrentesVsUnicosUncheckedCreateNestedManyWithoutDashboardInput
    produtosTop?: ProdutoRankUncheckedCreateNestedManyWithoutDashboardInput
    receitaPorCategoria?: ReceitaCategoriaUncheckedCreateNestedManyWithoutDashboardInput
  }

  export type DashboardComercialCreateOrConnectWithoutReceitaPorPagamentoInput = {
    where: DashboardComercialWhereUniqueInput
    create: XOR<DashboardComercialCreateWithoutReceitaPorPagamentoInput, DashboardComercialUncheckedCreateWithoutReceitaPorPagamentoInput>
  }

  export type DashboardComercialUpsertWithoutReceitaPorPagamentoInput = {
    update: XOR<DashboardComercialUpdateWithoutReceitaPorPagamentoInput, DashboardComercialUncheckedUpdateWithoutReceitaPorPagamentoInput>
    create: XOR<DashboardComercialCreateWithoutReceitaPorPagamentoInput, DashboardComercialUncheckedCreateWithoutReceitaPorPagamentoInput>
    where?: DashboardComercialWhereInput
  }

  export type DashboardComercialUpdateToOneWithWhereWithoutReceitaPorPagamentoInput = {
    where?: DashboardComercialWhereInput
    data: XOR<DashboardComercialUpdateWithoutReceitaPorPagamentoInput, DashboardComercialUncheckedUpdateWithoutReceitaPorPagamentoInput>
  }

  export type DashboardComercialUpdateWithoutReceitaPorPagamentoInput = {
    id?: StringFieldUpdateOperationsInput | string
    receitaTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ticketMedio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    crescimentoReceita?: FloatFieldUpdateOperationsInput | number
    novosClientes?: IntFieldUpdateOperationsInput | number
    taxaRetencaoClientes?: FloatFieldUpdateOperationsInput | number
    clv?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    volumeReparos?: IntFieldUpdateOperationsInput | number
    taxaReincidenciaReparos?: FloatFieldUpdateOperationsInput | number
    receitaReparosVsVendas?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clientesComparacao?: ClientesRecorrentesVsUnicosUpdateManyWithoutDashboardNestedInput
    organization?: OrganizationUpdateOneRequiredWithoutDashboardComercialNestedInput
    produtosTop?: ProdutoRankUpdateManyWithoutDashboardNestedInput
    receitaPorCategoria?: ReceitaCategoriaUpdateManyWithoutDashboardNestedInput
  }

  export type DashboardComercialUncheckedUpdateWithoutReceitaPorPagamentoInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    receitaTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ticketMedio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    crescimentoReceita?: FloatFieldUpdateOperationsInput | number
    novosClientes?: IntFieldUpdateOperationsInput | number
    taxaRetencaoClientes?: FloatFieldUpdateOperationsInput | number
    clv?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    volumeReparos?: IntFieldUpdateOperationsInput | number
    taxaReincidenciaReparos?: FloatFieldUpdateOperationsInput | number
    receitaReparosVsVendas?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clientesComparacao?: ClientesRecorrentesVsUnicosUncheckedUpdateManyWithoutDashboardNestedInput
    produtosTop?: ProdutoRankUncheckedUpdateManyWithoutDashboardNestedInput
    receitaPorCategoria?: ReceitaCategoriaUncheckedUpdateManyWithoutDashboardNestedInput
  }

  export type DashboardComercialCreateWithoutClientesComparacaoInput = {
    id?: string
    receitaTotal: Decimal | DecimalJsLike | number | string
    ticketMedio: Decimal | DecimalJsLike | number | string
    crescimentoReceita: number
    novosClientes: number
    taxaRetencaoClientes: number
    clv: Decimal | DecimalJsLike | number | string
    volumeReparos: number
    taxaReincidenciaReparos: number
    receitaReparosVsVendas: number
    createdAt?: Date | string
    updatedAt?: Date | string
    organization: OrganizationCreateNestedOneWithoutDashboardComercialInput
    produtosTop?: ProdutoRankCreateNestedManyWithoutDashboardInput
    receitaPorCategoria?: ReceitaCategoriaCreateNestedManyWithoutDashboardInput
    receitaPorPagamento?: ReceitaMetodoPagamentoCreateNestedManyWithoutDashboardInput
  }

  export type DashboardComercialUncheckedCreateWithoutClientesComparacaoInput = {
    id?: string
    organizationId: string
    receitaTotal: Decimal | DecimalJsLike | number | string
    ticketMedio: Decimal | DecimalJsLike | number | string
    crescimentoReceita: number
    novosClientes: number
    taxaRetencaoClientes: number
    clv: Decimal | DecimalJsLike | number | string
    volumeReparos: number
    taxaReincidenciaReparos: number
    receitaReparosVsVendas: number
    createdAt?: Date | string
    updatedAt?: Date | string
    produtosTop?: ProdutoRankUncheckedCreateNestedManyWithoutDashboardInput
    receitaPorCategoria?: ReceitaCategoriaUncheckedCreateNestedManyWithoutDashboardInput
    receitaPorPagamento?: ReceitaMetodoPagamentoUncheckedCreateNestedManyWithoutDashboardInput
  }

  export type DashboardComercialCreateOrConnectWithoutClientesComparacaoInput = {
    where: DashboardComercialWhereUniqueInput
    create: XOR<DashboardComercialCreateWithoutClientesComparacaoInput, DashboardComercialUncheckedCreateWithoutClientesComparacaoInput>
  }

  export type DashboardComercialUpsertWithoutClientesComparacaoInput = {
    update: XOR<DashboardComercialUpdateWithoutClientesComparacaoInput, DashboardComercialUncheckedUpdateWithoutClientesComparacaoInput>
    create: XOR<DashboardComercialCreateWithoutClientesComparacaoInput, DashboardComercialUncheckedCreateWithoutClientesComparacaoInput>
    where?: DashboardComercialWhereInput
  }

  export type DashboardComercialUpdateToOneWithWhereWithoutClientesComparacaoInput = {
    where?: DashboardComercialWhereInput
    data: XOR<DashboardComercialUpdateWithoutClientesComparacaoInput, DashboardComercialUncheckedUpdateWithoutClientesComparacaoInput>
  }

  export type DashboardComercialUpdateWithoutClientesComparacaoInput = {
    id?: StringFieldUpdateOperationsInput | string
    receitaTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ticketMedio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    crescimentoReceita?: FloatFieldUpdateOperationsInput | number
    novosClientes?: IntFieldUpdateOperationsInput | number
    taxaRetencaoClientes?: FloatFieldUpdateOperationsInput | number
    clv?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    volumeReparos?: IntFieldUpdateOperationsInput | number
    taxaReincidenciaReparos?: FloatFieldUpdateOperationsInput | number
    receitaReparosVsVendas?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organization?: OrganizationUpdateOneRequiredWithoutDashboardComercialNestedInput
    produtosTop?: ProdutoRankUpdateManyWithoutDashboardNestedInput
    receitaPorCategoria?: ReceitaCategoriaUpdateManyWithoutDashboardNestedInput
    receitaPorPagamento?: ReceitaMetodoPagamentoUpdateManyWithoutDashboardNestedInput
  }

  export type DashboardComercialUncheckedUpdateWithoutClientesComparacaoInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    receitaTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ticketMedio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    crescimentoReceita?: FloatFieldUpdateOperationsInput | number
    novosClientes?: IntFieldUpdateOperationsInput | number
    taxaRetencaoClientes?: FloatFieldUpdateOperationsInput | number
    clv?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    volumeReparos?: IntFieldUpdateOperationsInput | number
    taxaReincidenciaReparos?: FloatFieldUpdateOperationsInput | number
    receitaReparosVsVendas?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    produtosTop?: ProdutoRankUncheckedUpdateManyWithoutDashboardNestedInput
    receitaPorCategoria?: ReceitaCategoriaUncheckedUpdateManyWithoutDashboardNestedInput
    receitaPorPagamento?: ReceitaMetodoPagamentoUncheckedUpdateManyWithoutDashboardNestedInput
  }

  export type DashboardComercialCreateWithoutProdutosTopInput = {
    id?: string
    receitaTotal: Decimal | DecimalJsLike | number | string
    ticketMedio: Decimal | DecimalJsLike | number | string
    crescimentoReceita: number
    novosClientes: number
    taxaRetencaoClientes: number
    clv: Decimal | DecimalJsLike | number | string
    volumeReparos: number
    taxaReincidenciaReparos: number
    receitaReparosVsVendas: number
    createdAt?: Date | string
    updatedAt?: Date | string
    clientesComparacao?: ClientesRecorrentesVsUnicosCreateNestedManyWithoutDashboardInput
    organization: OrganizationCreateNestedOneWithoutDashboardComercialInput
    receitaPorCategoria?: ReceitaCategoriaCreateNestedManyWithoutDashboardInput
    receitaPorPagamento?: ReceitaMetodoPagamentoCreateNestedManyWithoutDashboardInput
  }

  export type DashboardComercialUncheckedCreateWithoutProdutosTopInput = {
    id?: string
    organizationId: string
    receitaTotal: Decimal | DecimalJsLike | number | string
    ticketMedio: Decimal | DecimalJsLike | number | string
    crescimentoReceita: number
    novosClientes: number
    taxaRetencaoClientes: number
    clv: Decimal | DecimalJsLike | number | string
    volumeReparos: number
    taxaReincidenciaReparos: number
    receitaReparosVsVendas: number
    createdAt?: Date | string
    updatedAt?: Date | string
    clientesComparacao?: ClientesRecorrentesVsUnicosUncheckedCreateNestedManyWithoutDashboardInput
    receitaPorCategoria?: ReceitaCategoriaUncheckedCreateNestedManyWithoutDashboardInput
    receitaPorPagamento?: ReceitaMetodoPagamentoUncheckedCreateNestedManyWithoutDashboardInput
  }

  export type DashboardComercialCreateOrConnectWithoutProdutosTopInput = {
    where: DashboardComercialWhereUniqueInput
    create: XOR<DashboardComercialCreateWithoutProdutosTopInput, DashboardComercialUncheckedCreateWithoutProdutosTopInput>
  }

  export type DashboardComercialUpsertWithoutProdutosTopInput = {
    update: XOR<DashboardComercialUpdateWithoutProdutosTopInput, DashboardComercialUncheckedUpdateWithoutProdutosTopInput>
    create: XOR<DashboardComercialCreateWithoutProdutosTopInput, DashboardComercialUncheckedCreateWithoutProdutosTopInput>
    where?: DashboardComercialWhereInput
  }

  export type DashboardComercialUpdateToOneWithWhereWithoutProdutosTopInput = {
    where?: DashboardComercialWhereInput
    data: XOR<DashboardComercialUpdateWithoutProdutosTopInput, DashboardComercialUncheckedUpdateWithoutProdutosTopInput>
  }

  export type DashboardComercialUpdateWithoutProdutosTopInput = {
    id?: StringFieldUpdateOperationsInput | string
    receitaTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ticketMedio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    crescimentoReceita?: FloatFieldUpdateOperationsInput | number
    novosClientes?: IntFieldUpdateOperationsInput | number
    taxaRetencaoClientes?: FloatFieldUpdateOperationsInput | number
    clv?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    volumeReparos?: IntFieldUpdateOperationsInput | number
    taxaReincidenciaReparos?: FloatFieldUpdateOperationsInput | number
    receitaReparosVsVendas?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clientesComparacao?: ClientesRecorrentesVsUnicosUpdateManyWithoutDashboardNestedInput
    organization?: OrganizationUpdateOneRequiredWithoutDashboardComercialNestedInput
    receitaPorCategoria?: ReceitaCategoriaUpdateManyWithoutDashboardNestedInput
    receitaPorPagamento?: ReceitaMetodoPagamentoUpdateManyWithoutDashboardNestedInput
  }

  export type DashboardComercialUncheckedUpdateWithoutProdutosTopInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    receitaTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ticketMedio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    crescimentoReceita?: FloatFieldUpdateOperationsInput | number
    novosClientes?: IntFieldUpdateOperationsInput | number
    taxaRetencaoClientes?: FloatFieldUpdateOperationsInput | number
    clv?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    volumeReparos?: IntFieldUpdateOperationsInput | number
    taxaReincidenciaReparos?: FloatFieldUpdateOperationsInput | number
    receitaReparosVsVendas?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clientesComparacao?: ClientesRecorrentesVsUnicosUncheckedUpdateManyWithoutDashboardNestedInput
    receitaPorCategoria?: ReceitaCategoriaUncheckedUpdateManyWithoutDashboardNestedInput
    receitaPorPagamento?: ReceitaMetodoPagamentoUncheckedUpdateManyWithoutDashboardNestedInput
  }

  export type UserCreateManyOrganizationInput = {
    id?: string
    name: string
    email: string
    password: string
    role: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnuncioCTRCreateManyDashboardInput = {
    id?: string
    nome: string
    ctr: number
  }

  export type AnuncioConversaoCreateManyDashboardInput = {
    id?: string
    nome: string
    conversoes: number
  }

  export type CanalTrafegoCreateManyDashboardInput = {
    id?: string
    canal: string
    taxaConversao: number
    cpa: Decimal | DecimalJsLike | number | string
    roi: number
  }

  export type PalavraChaveCreateManyDashboardInput = {
    id?: string
    palavra: string
    ctr: number
  }

  export type TrafegoCreateManyDashboardInput = {
    id?: string
    origem: string
    valor: number
  }

  export type AnuncioCTRUpdateWithoutDashboardInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    ctr?: FloatFieldUpdateOperationsInput | number
  }

  export type AnuncioCTRUncheckedUpdateWithoutDashboardInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    ctr?: FloatFieldUpdateOperationsInput | number
  }

  export type AnuncioCTRUncheckedUpdateManyWithoutDashboardInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    ctr?: FloatFieldUpdateOperationsInput | number
  }

  export type AnuncioConversaoUpdateWithoutDashboardInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    conversoes?: IntFieldUpdateOperationsInput | number
  }

  export type AnuncioConversaoUncheckedUpdateWithoutDashboardInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    conversoes?: IntFieldUpdateOperationsInput | number
  }

  export type AnuncioConversaoUncheckedUpdateManyWithoutDashboardInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    conversoes?: IntFieldUpdateOperationsInput | number
  }

  export type CanalTrafegoUpdateWithoutDashboardInput = {
    id?: StringFieldUpdateOperationsInput | string
    canal?: StringFieldUpdateOperationsInput | string
    taxaConversao?: FloatFieldUpdateOperationsInput | number
    cpa?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    roi?: FloatFieldUpdateOperationsInput | number
  }

  export type CanalTrafegoUncheckedUpdateWithoutDashboardInput = {
    id?: StringFieldUpdateOperationsInput | string
    canal?: StringFieldUpdateOperationsInput | string
    taxaConversao?: FloatFieldUpdateOperationsInput | number
    cpa?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    roi?: FloatFieldUpdateOperationsInput | number
  }

  export type CanalTrafegoUncheckedUpdateManyWithoutDashboardInput = {
    id?: StringFieldUpdateOperationsInput | string
    canal?: StringFieldUpdateOperationsInput | string
    taxaConversao?: FloatFieldUpdateOperationsInput | number
    cpa?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    roi?: FloatFieldUpdateOperationsInput | number
  }

  export type PalavraChaveUpdateWithoutDashboardInput = {
    id?: StringFieldUpdateOperationsInput | string
    palavra?: StringFieldUpdateOperationsInput | string
    ctr?: FloatFieldUpdateOperationsInput | number
  }

  export type PalavraChaveUncheckedUpdateWithoutDashboardInput = {
    id?: StringFieldUpdateOperationsInput | string
    palavra?: StringFieldUpdateOperationsInput | string
    ctr?: FloatFieldUpdateOperationsInput | number
  }

  export type PalavraChaveUncheckedUpdateManyWithoutDashboardInput = {
    id?: StringFieldUpdateOperationsInput | string
    palavra?: StringFieldUpdateOperationsInput | string
    ctr?: FloatFieldUpdateOperationsInput | number
  }

  export type TrafegoUpdateWithoutDashboardInput = {
    id?: StringFieldUpdateOperationsInput | string
    origem?: StringFieldUpdateOperationsInput | string
    valor?: IntFieldUpdateOperationsInput | number
  }

  export type TrafegoUncheckedUpdateWithoutDashboardInput = {
    id?: StringFieldUpdateOperationsInput | string
    origem?: StringFieldUpdateOperationsInput | string
    valor?: IntFieldUpdateOperationsInput | number
  }

  export type TrafegoUncheckedUpdateManyWithoutDashboardInput = {
    id?: StringFieldUpdateOperationsInput | string
    origem?: StringFieldUpdateOperationsInput | string
    valor?: IntFieldUpdateOperationsInput | number
  }

  export type ClientesRecorrentesVsUnicosCreateManyDashboardInput = {
    id?: string
    tipoCliente: string
    quantidade: number
  }

  export type ProdutoRankCreateManyDashboardInput = {
    id?: string
    produto: string
    vendas: number
  }

  export type ReceitaCategoriaCreateManyDashboardInput = {
    id?: string
    categoria: string
    receita: Decimal | DecimalJsLike | number | string
  }

  export type ReceitaMetodoPagamentoCreateManyDashboardInput = {
    id?: string
    metodoPagamento: string
    receita: Decimal | DecimalJsLike | number | string
  }

  export type ClientesRecorrentesVsUnicosUpdateWithoutDashboardInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipoCliente?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
  }

  export type ClientesRecorrentesVsUnicosUncheckedUpdateWithoutDashboardInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipoCliente?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
  }

  export type ClientesRecorrentesVsUnicosUncheckedUpdateManyWithoutDashboardInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipoCliente?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
  }

  export type ProdutoRankUpdateWithoutDashboardInput = {
    id?: StringFieldUpdateOperationsInput | string
    produto?: StringFieldUpdateOperationsInput | string
    vendas?: IntFieldUpdateOperationsInput | number
  }

  export type ProdutoRankUncheckedUpdateWithoutDashboardInput = {
    id?: StringFieldUpdateOperationsInput | string
    produto?: StringFieldUpdateOperationsInput | string
    vendas?: IntFieldUpdateOperationsInput | number
  }

  export type ProdutoRankUncheckedUpdateManyWithoutDashboardInput = {
    id?: StringFieldUpdateOperationsInput | string
    produto?: StringFieldUpdateOperationsInput | string
    vendas?: IntFieldUpdateOperationsInput | number
  }

  export type ReceitaCategoriaUpdateWithoutDashboardInput = {
    id?: StringFieldUpdateOperationsInput | string
    categoria?: StringFieldUpdateOperationsInput | string
    receita?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type ReceitaCategoriaUncheckedUpdateWithoutDashboardInput = {
    id?: StringFieldUpdateOperationsInput | string
    categoria?: StringFieldUpdateOperationsInput | string
    receita?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type ReceitaCategoriaUncheckedUpdateManyWithoutDashboardInput = {
    id?: StringFieldUpdateOperationsInput | string
    categoria?: StringFieldUpdateOperationsInput | string
    receita?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type ReceitaMetodoPagamentoUpdateWithoutDashboardInput = {
    id?: StringFieldUpdateOperationsInput | string
    metodoPagamento?: StringFieldUpdateOperationsInput | string
    receita?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type ReceitaMetodoPagamentoUncheckedUpdateWithoutDashboardInput = {
    id?: StringFieldUpdateOperationsInput | string
    metodoPagamento?: StringFieldUpdateOperationsInput | string
    receita?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type ReceitaMetodoPagamentoUncheckedUpdateManyWithoutDashboardInput = {
    id?: StringFieldUpdateOperationsInput | string
    metodoPagamento?: StringFieldUpdateOperationsInput | string
    receita?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}