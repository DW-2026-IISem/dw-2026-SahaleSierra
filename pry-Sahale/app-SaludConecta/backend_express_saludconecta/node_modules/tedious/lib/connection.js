"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _crypto = _interopRequireDefault(require("crypto"));
var _os = _interopRequireDefault(require("os"));
var tls = _interopRequireWildcard(require("tls"));
var net = _interopRequireWildcard(require("net"));
var _dns = _interopRequireDefault(require("dns"));
var _constants = _interopRequireDefault(require("constants"));
var _stream = require("stream");
var _identity = require("@azure/identity");
var _coreAuth = require("@azure/core-auth");
var _bulkLoad = _interopRequireDefault(require("./bulk-load"));
var _debug = _interopRequireDefault(require("./debug"));
var _events = require("events");
var _instanceLookup = require("./instance-lookup");
var _transientErrorLookup = require("./transient-error-lookup");
var _packet = require("./packet");
var _preloginPayload = _interopRequireDefault(require("./prelogin-payload"));
var _login7Payload = _interopRequireDefault(require("./login7-payload"));
var _ntlmPayload = _interopRequireDefault(require("./ntlm-payload"));
var _request = _interopRequireDefault(require("./request"));
var _rpcrequestPayload = _interopRequireDefault(require("./rpcrequest-payload"));
var _sqlbatchPayload = _interopRequireDefault(require("./sqlbatch-payload"));
var _messageIo = _interopRequireDefault(require("./message-io"));
var _tokenStreamParser = require("./token/token-stream-parser");
var _transaction = require("./transaction");
var _errors = require("./errors");
var _connector = require("./connector");
var _library = require("./library");
var _tdsVersions = require("./tds-versions");
var _message = _interopRequireDefault(require("./message"));
var _ntlm = require("./ntlm");
var _dataType = require("./data-type");
var _bulkLoadPayload = require("./bulk-load-payload");
var _specialStoredProcedure = _interopRequireDefault(require("./special-stored-procedure"));
var _package = require("../package.json");
var _url = require("url");
var _handler = require("./token/handler");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// eslint-disable-next-line @typescript-eslint/no-unused-vars

/**
 * @private
 */
const KEEP_ALIVE_INITIAL_DELAY = 30 * 1000;
/**
 * @private
 */
const DEFAULT_CONNECT_TIMEOUT = 15 * 1000;
/**
 * @private
 */
const DEFAULT_CLIENT_REQUEST_TIMEOUT = 15 * 1000;
/**
 * @private
 */
const DEFAULT_CANCEL_TIMEOUT = 5 * 1000;
/**
 * @private
 */
const DEFAULT_CONNECT_RETRY_INTERVAL = 500;
/**
 * @private
 */
const DEFAULT_PACKET_SIZE = 4 * 1024;
/**
 * @private
 */
const DEFAULT_TEXTSIZE = 2147483647;
/**
 * @private
 */
const DEFAULT_DATEFIRST = 7;
/**
 * @private
 */
const DEFAULT_PORT = 1433;
/**
 * @private
 */
const DEFAULT_TDS_VERSION = '7_4';
/**
 * @private
 */
const DEFAULT_LANGUAGE = 'us_english';
/**
 * @private
 */
const DEFAULT_DATEFORMAT = 'mdy';

/** Structure that defines the options that are necessary to authenticate the Tedious.JS instance with an `@azure/identity` token credential. */

/**
 * @private
 */

/**
 * Helper function, equivalent to `Promise.withResolvers()`.
 *
 * @returns An object with the properties `promise`, `resolve`, and `reject`.
 */
function withResolvers() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return {
    promise,
    resolve: resolve,
    reject: reject
  };
}

/**
 * A [[Connection]] instance represents a single connection to a database server.
 *
 * ```js
 * var Connection = require('tedious').Connection;
 * var config = {
 *  "authentication": {
 *    ...,
 *    "options": {...}
 *  },
 *  "options": {...}
 * };
 * var connection = new Connection(config);
 * ```
 *
 * Only one request at a time may be executed on a connection. Once a [[Request]]
 * has been initiated (with [[Connection.callProcedure]], [[Connection.execSql]],
 * or [[Connection.execSqlBatch]]), another should not be initiated until the
 * [[Request]]'s completion callback is called.
 */
class Connection extends _events.EventEmitter {
  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * Whether an attention message was sent to the server to cancel the
   * currently active request.
   *
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * Note: be aware of the different options field:
   * 1. config.authentication.options
   * 2. config.options
   *
   * ```js
   * const { Connection } = require('tedious');
   *
   * const config = {
   *  "authentication": {
   *    ...,
   *    "options": {...}
   *  },
   *  "options": {...}
   * };
   *
   * const connection = new Connection(config);
   * ```
   *
   * @param config
   */
  constructor(config) {
    super();
    if (typeof config !== 'object' || config === null) {
      throw new TypeError('The "config" argument is required and must be of type Object.');
    }
    if (typeof config.server !== 'string') {
      throw new TypeError('The "config.server" property is required and must be of type string.');
    }
    this.fedAuthRequired = false;
    let authentication;
    if (config.authentication !== undefined) {
      if (typeof config.authentication !== 'object' || config.authentication === null) {
        throw new TypeError('The "config.authentication" property must be of type Object.');
      }
      const type = config.authentication.type;
      const options = config.authentication.options === undefined ? {} : config.authentication.options;
      if (typeof type !== 'string') {
        throw new TypeError('The "config.authentication.type" property must be of type string.');
      }
      if (type !== 'default' && type !== 'ntlm' && type !== 'token-credential' && type !== 'azure-active-directory-password' && type !== 'azure-active-directory-access-token' && type !== 'azure-active-directory-msi-vm' && type !== 'azure-active-directory-msi-app-service' && type !== 'azure-active-directory-service-principal-secret' && type !== 'azure-active-directory-default') {
        throw new TypeError('The "type" property must one of "default", "ntlm", "token-credential", "azure-active-directory-password", "azure-active-directory-access-token", "azure-active-directory-default", "azure-active-directory-msi-vm" or "azure-active-directory-msi-app-service" or "azure-active-directory-service-principal-secret".');
      }
      if (typeof options !== 'object' || options === null) {
        throw new TypeError('The "config.authentication.options" property must be of type object.');
      }
      if (type === 'ntlm') {
        if (typeof options.domain !== 'string') {
          throw new TypeError('The "config.authentication.options.domain" property must be of type string.');
        }
        if (options.userName !== undefined && typeof options.userName !== 'string') {
          throw new TypeError('The "config.authentication.options.userName" property must be of type string.');
        }
        if (options.password !== undefined && typeof options.password !== 'string') {
          throw new TypeError('The "config.authentication.options.password" property must be of type string.');
        }
        authentication = {
          type: 'ntlm',
          options: {
            userName: options.userName,
            password: options.password,
            domain: options.domain && options.domain.toUpperCase()
          }
        };
      } else if (type === 'token-credential') {
        if (!(0, _coreAuth.isTokenCredential)(options.credential)) {
          throw new TypeError('The "config.authentication.options.credential" property must be an instance of the token credential class.');
        }
        authentication = {
          type: 'token-credential',
          options: {
            credential: options.credential
          }
        };
      } else if (type === 'azure-active-directory-password') {
        if (typeof options.clientId !== 'string') {
          throw new TypeError('The "config.authentication.options.clientId" property must be of type string.');
        }
        if (options.userName !== undefined && typeof options.userName !== 'string') {
          throw new TypeError('The "config.authentication.options.userName" property must be of type string.');
        }
        if (options.password !== undefined && typeof options.password !== 'string') {
          throw new TypeError('The "config.authentication.options.password" property must be of type string.');
        }
        if (options.tenantId !== undefined && typeof options.tenantId !== 'string') {
          throw new TypeError('The "config.authentication.options.tenantId" property must be of type string.');
        }
        authentication = {
          type: 'azure-active-directory-password',
          options: {
            userName: options.userName,
            password: options.password,
            tenantId: options.tenantId,
            clientId: options.clientId
          }
        };
      } else if (type === 'azure-active-directory-access-token') {
        if (typeof options.token !== 'string') {
          throw new TypeError('The "config.authentication.options.token" property must be of type string.');
        }
        authentication = {
          type: 'azure-active-directory-access-token',
          options: {
            token: options.token
          }
        };
      } else if (type === 'azure-active-directory-msi-vm') {
        if (options.clientId !== undefined && typeof options.clientId !== 'string') {
          throw new TypeError('The "config.authentication.options.clientId" property must be of type string.');
        }
        authentication = {
          type: 'azure-active-directory-msi-vm',
          options: {
            clientId: options.clientId
          }
        };
      } else if (type === 'azure-active-directory-default') {
        if (options.clientId !== undefined && typeof options.clientId !== 'string') {
          throw new TypeError('The "config.authentication.options.clientId" property must be of type string.');
        }
        authentication = {
          type: 'azure-active-directory-default',
          options: {
            clientId: options.clientId
          }
        };
      } else if (type === 'azure-active-directory-msi-app-service') {
        if (options.clientId !== undefined && typeof options.clientId !== 'string') {
          throw new TypeError('The "config.authentication.options.clientId" property must be of type string.');
        }
        authentication = {
          type: 'azure-active-directory-msi-app-service',
          options: {
            clientId: options.clientId
          }
        };
      } else if (type === 'azure-active-directory-service-principal-secret') {
        if (typeof options.clientId !== 'string') {
          throw new TypeError('The "config.authentication.options.clientId" property must be of type string.');
        }
        if (typeof options.clientSecret !== 'string') {
          throw new TypeError('The "config.authentication.options.clientSecret" property must be of type string.');
        }
        if (typeof options.tenantId !== 'string') {
          throw new TypeError('The "config.authentication.options.tenantId" property must be of type string.');
        }
        authentication = {
          type: 'azure-active-directory-service-principal-secret',
          options: {
            clientId: options.clientId,
            clientSecret: options.clientSecret,
            tenantId: options.tenantId
          }
        };
      } else {
        if (options.userName !== undefined && typeof options.userName !== 'string') {
          throw new TypeError('The "config.authentication.options.userName" property must be of type string.');
        }
        if (options.password !== undefined && typeof options.password !== 'string') {
          throw new TypeError('The "config.authentication.options.password" property must be of type string.');
        }
        authentication = {
          type: 'default',
          options: {
            userName: options.userName,
            password: options.password
          }
        };
      }
    } else {
      authentication = {
        type: 'default',
        options: {
          userName: undefined,
          password: undefined
        }
      };
    }
    this.config = {
      server: config.server,
      authentication: authentication,
      options: {
        abortTransactionOnError: false,
        appName: undefined,
        camelCaseColumns: false,
        cancelTimeout: DEFAULT_CANCEL_TIMEOUT,
        columnEncryptionKeyCacheTTL: 2 * 60 * 60 * 1000,
        // Units: milliseconds
        columnEncryptionSetting: false,
        columnNameReplacer: undefined,
        connectionRetryInterval: DEFAULT_CONNECT_RETRY_INTERVAL,
        connectTimeout: DEFAULT_CONNECT_TIMEOUT,
        connector: undefined,
        connectionIsolationLevel: _transaction.ISOLATION_LEVEL.READ_COMMITTED,
        cryptoCredentialsDetails: {},
        database: undefined,
        datefirst: DEFAULT_DATEFIRST,
        dateFormat: DEFAULT_DATEFORMAT,
        debug: {
          data: false,
          packet: false,
          payload: false,
          token: false
        },
        enableAnsiNull: true,
        enableAnsiNullDefault: true,
        enableAnsiPadding: true,
        enableAnsiWarnings: true,
        enableArithAbort: true,
        enableConcatNullYieldsNull: true,
        enableCursorCloseOnCommit: null,
        enableImplicitTransactions: false,
        enableNumericRoundabort: false,
        enableQuotedIdentifier: true,
        encrypt: true,
        fallbackToDefaultDb: false,
        encryptionKeyStoreProviders: undefined,
        instanceName: undefined,
        isolationLevel: _transaction.ISOLATION_LEVEL.READ_COMMITTED,
        language: DEFAULT_LANGUAGE,
        localAddress: undefined,
        maxRetriesOnTransientErrors: 3,
        multiSubnetFailover: false,
        packetSize: DEFAULT_PACKET_SIZE,
        port: DEFAULT_PORT,
        readOnlyIntent: false,
        requestTimeout: DEFAULT_CLIENT_REQUEST_TIMEOUT,
        rowCollectionOnDone: false,
        rowCollectionOnRequestCompletion: false,
        serverName: undefined,
        serverSupportsColumnEncryption: false,
        tdsVersion: DEFAULT_TDS_VERSION,
        textsize: DEFAULT_TEXTSIZE,
        trustedServerNameAE: undefined,
        trustServerCertificate: false,
        useColumnNames: false,
        useUTC: true,
        workstationId: undefined,
        lowerCaseGuids: false
      }
    };
    if (config.options) {
      if (config.options.port && config.options.instanceName) {
        throw new Error('Port and instanceName are mutually exclusive, but ' + config.options.port + ' and ' + config.options.instanceName + ' provided');
      }
      if (config.options.abortTransactionOnError !== undefined) {
        if (typeof config.options.abortTransactionOnError !== 'boolean' && config.options.abortTransactionOnError !== null) {
          throw new TypeError('The "config.options.abortTransactionOnError" property must be of type string or null.');
        }
        this.config.options.abortTransactionOnError = config.options.abortTransactionOnError;
      }
      if (config.options.appName !== undefined) {
        if (typeof config.options.appName !== 'string') {
          throw new TypeError('The "config.options.appName" property must be of type string.');
        }
        this.config.options.appName = config.options.appName;
      }
      if (config.options.camelCaseColumns !== undefined) {
        if (typeof config.options.camelCaseColumns !== 'boolean') {
          throw new TypeError('The "config.options.camelCaseColumns" property must be of type boolean.');
        }
        this.config.options.camelCaseColumns = config.options.camelCaseColumns;
      }
      if (config.options.cancelTimeout !== undefined) {
        if (typeof config.options.cancelTimeout !== 'number') {
          throw new TypeError('The "config.options.cancelTimeout" property must be of type number.');
        }
        this.config.options.cancelTimeout = config.options.cancelTimeout;
      }
      if (config.options.columnNameReplacer) {
        if (typeof config.options.columnNameReplacer !== 'function') {
          throw new TypeError('The "config.options.cancelTimeout" property must be of type function.');
        }
        this.config.options.columnNameReplacer = config.options.columnNameReplacer;
      }
      if (config.options.connectionIsolationLevel !== undefined) {
        (0, _transaction.assertValidIsolationLevel)(config.options.connectionIsolationLevel, 'config.options.connectionIsolationLevel');
        this.config.options.connectionIsolationLevel = config.options.connectionIsolationLevel;
      }
      if (config.options.connectTimeout !== undefined) {
        if (typeof config.options.connectTimeout !== 'number') {
          throw new TypeError('The "config.options.connectTimeout" property must be of type number.');
        }
        this.config.options.connectTimeout = config.options.connectTimeout;
      }
      if (config.options.connector !== undefined) {
        if (typeof config.options.connector !== 'function') {
          throw new TypeError('The "config.options.connector" property must be a function.');
        }
        this.config.options.connector = config.options.connector;
      }
      if (config.options.cryptoCredentialsDetails !== undefined) {
        if (typeof config.options.cryptoCredentialsDetails !== 'object' || config.options.cryptoCredentialsDetails === null) {
          throw new TypeError('The "config.options.cryptoCredentialsDetails" property must be of type Object.');
        }
        this.config.options.cryptoCredentialsDetails = config.options.cryptoCredentialsDetails;
      }
      if (config.options.database !== undefined) {
        if (typeof config.options.database !== 'string') {
          throw new TypeError('The "config.options.database" property must be of type string.');
        }
        this.config.options.database = config.options.database;
      }
      if (config.options.datefirst !== undefined) {
        if (typeof config.options.datefirst !== 'number' && config.options.datefirst !== null) {
          throw new TypeError('The "config.options.datefirst" property must be of type number.');
        }
        if (config.options.datefirst !== null && (config.options.datefirst < 1 || config.options.datefirst > 7)) {
          throw new RangeError('The "config.options.datefirst" property must be >= 1 and <= 7');
        }
        this.config.options.datefirst = config.options.datefirst;
      }
      if (config.options.dateFormat !== undefined) {
        if (typeof config.options.dateFormat !== 'string' && config.options.dateFormat !== null) {
          throw new TypeError('The "config.options.dateFormat" property must be of type string or null.');
        }
        this.config.options.dateFormat = config.options.dateFormat;
      }
      if (config.options.debug) {
        if (config.options.debug.data !== undefined) {
          if (typeof config.options.debug.data !== 'boolean') {
            throw new TypeError('The "config.options.debug.data" property must be of type boolean.');
          }
          this.config.options.debug.data = config.options.debug.data;
        }
        if (config.options.debug.packet !== undefined) {
          if (typeof config.options.debug.packet !== 'boolean') {
            throw new TypeError('The "config.options.debug.packet" property must be of type boolean.');
          }
          this.config.options.debug.packet = config.options.debug.packet;
        }
        if (config.options.debug.payload !== undefined) {
          if (typeof config.options.debug.payload !== 'boolean') {
            throw new TypeError('The "config.options.debug.payload" property must be of type boolean.');
          }
          this.config.options.debug.payload = config.options.debug.payload;
        }
        if (config.options.debug.token !== undefined) {
          if (typeof config.options.debug.token !== 'boolean') {
            throw new TypeError('The "config.options.debug.token" property must be of type boolean.');
          }
          this.config.options.debug.token = config.options.debug.token;
        }
      }
      if (config.options.enableAnsiNull !== undefined) {
        if (typeof config.options.enableAnsiNull !== 'boolean' && config.options.enableAnsiNull !== null) {
          throw new TypeError('The "config.options.enableAnsiNull" property must be of type boolean or null.');
        }
        this.config.options.enableAnsiNull = config.options.enableAnsiNull;
      }
      if (config.options.enableAnsiNullDefault !== undefined) {
        if (typeof config.options.enableAnsiNullDefault !== 'boolean' && config.options.enableAnsiNullDefault !== null) {
          throw new TypeError('The "config.options.enableAnsiNullDefault" property must be of type boolean or null.');
        }
        this.config.options.enableAnsiNullDefault = config.options.enableAnsiNullDefault;
      }
      if (config.options.enableAnsiPadding !== undefined) {
        if (typeof config.options.enableAnsiPadding !== 'boolean' && config.options.enableAnsiPadding !== null) {
          throw new TypeError('The "config.options.enableAnsiPadding" property must be of type boolean or null.');
        }
        this.config.options.enableAnsiPadding = config.options.enableAnsiPadding;
      }
      if (config.options.enableAnsiWarnings !== undefined) {
        if (typeof config.options.enableAnsiWarnings !== 'boolean' && config.options.enableAnsiWarnings !== null) {
          throw new TypeError('The "config.options.enableAnsiWarnings" property must be of type boolean or null.');
        }
        this.config.options.enableAnsiWarnings = config.options.enableAnsiWarnings;
      }
      if (config.options.enableArithAbort !== undefined) {
        if (typeof config.options.enableArithAbort !== 'boolean' && config.options.enableArithAbort !== null) {
          throw new TypeError('The "config.options.enableArithAbort" property must be of type boolean or null.');
        }
        this.config.options.enableArithAbort = config.options.enableArithAbort;
      }
      if (config.options.enableConcatNullYieldsNull !== undefined) {
        if (typeof config.options.enableConcatNullYieldsNull !== 'boolean' && config.options.enableConcatNullYieldsNull !== null) {
          throw new TypeError('The "config.options.enableConcatNullYieldsNull" property must be of type boolean or null.');
        }
        this.config.options.enableConcatNullYieldsNull = config.options.enableConcatNullYieldsNull;
      }
      if (config.options.enableCursorCloseOnCommit !== undefined) {
        if (typeof config.options.enableCursorCloseOnCommit !== 'boolean' && config.options.enableCursorCloseOnCommit !== null) {
          throw new TypeError('The "config.options.enableCursorCloseOnCommit" property must be of type boolean or null.');
        }
        this.config.options.enableCursorCloseOnCommit = config.options.enableCursorCloseOnCommit;
      }
      if (config.options.enableImplicitTransactions !== undefined) {
        if (typeof config.options.enableImplicitTransactions !== 'boolean' && config.options.enableImplicitTransactions !== null) {
          throw new TypeError('The "config.options.enableImplicitTransactions" property must be of type boolean or null.');
        }
        this.config.options.enableImplicitTransactions = config.options.enableImplicitTransactions;
      }
      if (config.options.enableNumericRoundabort !== undefined) {
        if (typeof config.options.enableNumericRoundabort !== 'boolean' && config.options.enableNumericRoundabort !== null) {
          throw new TypeError('The "config.options.enableNumericRoundabort" property must be of type boolean or null.');
        }
        this.config.options.enableNumericRoundabort = config.options.enableNumericRoundabort;
      }
      if (config.options.enableQuotedIdentifier !== undefined) {
        if (typeof config.options.enableQuotedIdentifier !== 'boolean' && config.options.enableQuotedIdentifier !== null) {
          throw new TypeError('The "config.options.enableQuotedIdentifier" property must be of type boolean or null.');
        }
        this.config.options.enableQuotedIdentifier = config.options.enableQuotedIdentifier;
      }
      if (config.options.encrypt !== undefined) {
        if (typeof config.options.encrypt !== 'boolean') {
          if (config.options.encrypt !== 'strict') {
            throw new TypeError('The "encrypt" property must be set to "strict", or of type boolean.');
          }
        }
        this.config.options.encrypt = config.options.encrypt;
      }
      if (config.options.fallbackToDefaultDb !== undefined) {
        if (typeof config.options.fallbackToDefaultDb !== 'boolean') {
          throw new TypeError('The "config.options.fallbackToDefaultDb" property must be of type boolean.');
        }
        this.config.options.fallbackToDefaultDb = config.options.fallbackToDefaultDb;
      }
      if (config.options.instanceName !== undefined) {
        if (typeof config.options.instanceName !== 'string') {
          throw new TypeError('The "config.options.instanceName" property must be of type string.');
        }
        this.config.options.instanceName = config.options.instanceName;
        this.config.options.port = undefined;
      }
      if (config.options.isolationLevel !== undefined) {
        (0, _transaction.assertValidIsolationLevel)(config.options.isolationLevel, 'config.options.isolationLevel');
        this.config.options.isolationLevel = config.options.isolationLevel;
      }
      if (config.options.language !== undefined) {
        if (typeof config.options.language !== 'string' && config.options.language !== null) {
          throw new TypeError('The "config.options.language" property must be of type string or null.');
        }
        this.config.options.language = config.options.language;
      }
      if (config.options.localAddress !== undefined) {
        if (typeof config.options.localAddress !== 'string') {
          throw new TypeError('The "config.options.localAddress" property must be of type string.');
        }
        this.config.options.localAddress = config.options.localAddress;
      }
      if (config.options.multiSubnetFailover !== undefined) {
        if (typeof config.options.multiSubnetFailover !== 'boolean') {
          throw new TypeError('The "config.options.multiSubnetFailover" property must be of type boolean.');
        }
        this.config.options.multiSubnetFailover = config.options.multiSubnetFailover;
      }
      if (config.options.packetSize !== undefined) {
        if (typeof config.options.packetSize !== 'number') {
          throw new TypeError('The "config.options.packetSize" property must be of type number.');
        }
        this.config.options.packetSize = config.options.packetSize;
      }
      if (config.options.port !== undefined) {
        if (typeof config.options.port !== 'number') {
          throw new TypeError('The "config.options.port" property must be of type number.');
        }
        if (config.options.port <= 0 || config.options.port >= 65536) {
          throw new RangeError('The "config.options.port" property must be > 0 and < 65536');
        }
        this.config.options.port = config.options.port;
        this.config.options.instanceName = undefined;
      }
      if (config.options.readOnlyIntent !== undefined) {
        if (typeof config.options.readOnlyIntent !== 'boolean') {
          throw new TypeError('The "config.options.readOnlyIntent" property must be of type boolean.');
        }
        this.config.options.readOnlyIntent = config.options.readOnlyIntent;
      }
      if (config.options.requestTimeout !== undefined) {
        if (typeof config.options.requestTimeout !== 'number') {
          throw new TypeError('The "config.options.requestTimeout" property must be of type number.');
        }
        this.config.options.requestTimeout = config.options.requestTimeout;
      }
      if (config.options.maxRetriesOnTransientErrors !== undefined) {
        if (typeof config.options.maxRetriesOnTransientErrors !== 'number') {
          throw new TypeError('The "config.options.maxRetriesOnTransientErrors" property must be of type number.');
        }
        if (config.options.maxRetriesOnTransientErrors < 0) {
          throw new TypeError('The "config.options.maxRetriesOnTransientErrors" property must be equal or greater than 0.');
        }
        this.config.options.maxRetriesOnTransientErrors = config.options.maxRetriesOnTransientErrors;
      }
      if (config.options.connectionRetryInterval !== undefined) {
        if (typeof config.options.connectionRetryInterval !== 'number') {
          throw new TypeError('The "config.options.connectionRetryInterval" property must be of type number.');
        }
        if (config.options.connectionRetryInterval <= 0) {
          throw new TypeError('The "config.options.connectionRetryInterval" property must be greater than 0.');
        }
        this.config.options.connectionRetryInterval = config.options.connectionRetryInterval;
      }
      if (config.options.rowCollectionOnDone !== undefined) {
        if (typeof config.options.rowCollectionOnDone !== 'boolean') {
          throw new TypeError('The "config.options.rowCollectionOnDone" property must be of type boolean.');
        }
        this.config.options.rowCollectionOnDone = config.options.rowCollectionOnDone;
      }
      if (config.options.rowCollectionOnRequestCompletion !== undefined) {
        if (typeof config.options.rowCollectionOnRequestCompletion !== 'boolean') {
          throw new TypeError('The "config.options.rowCollectionOnRequestCompletion" property must be of type boolean.');
        }
        this.config.options.rowCollectionOnRequestCompletion = config.options.rowCollectionOnRequestCompletion;
      }
      if (config.options.tdsVersion !== undefined) {
        if (typeof config.options.tdsVersion !== 'string') {
          throw new TypeError('The "config.options.tdsVersion" property must be of type string.');
        }
        this.config.options.tdsVersion = config.options.tdsVersion;
      }
      if (config.options.textsize !== undefined) {
        if (typeof config.options.textsize !== 'number' && config.options.textsize !== null) {
          throw new TypeError('The "config.options.textsize" property must be of type number or null.');
        }
        if (config.options.textsize > 2147483647) {
          throw new TypeError('The "config.options.textsize" can\'t be greater than 2147483647.');
        } else if (config.options.textsize < -1) {
          throw new TypeError('The "config.options.textsize" can\'t be smaller than -1.');
        }
        this.config.options.textsize = config.options.textsize | 0;
      }
      if (config.options.trustServerCertificate !== undefined) {
        if (typeof config.options.trustServerCertificate !== 'boolean') {
          throw new TypeError('The "config.options.trustServerCertificate" property must be of type boolean.');
        }
        this.config.options.trustServerCertificate = config.options.trustServerCertificate;
      }
      if (config.options.serverName !== undefined) {
        if (typeof config.options.serverName !== 'string') {
          throw new TypeError('The "config.options.serverName" property must be of type string.');
        }
        this.config.options.serverName = config.options.serverName;
      }
      if (config.options.useColumnNames !== undefined) {
        if (typeof config.options.useColumnNames !== 'boolean') {
          throw new TypeError('The "config.options.useColumnNames" property must be of type boolean.');
        }
        this.config.options.useColumnNames = config.options.useColumnNames;
      }
      if (config.options.useUTC !== undefined) {
        if (typeof config.options.useUTC !== 'boolean') {
          throw new TypeError('The "config.options.useUTC" property must be of type boolean.');
        }
        this.config.options.useUTC = config.options.useUTC;
      }
      if (config.options.workstationId !== undefined) {
        if (typeof config.options.workstationId !== 'string') {
          throw new TypeError('The "config.options.workstationId" property must be of type string.');
        }
        this.config.options.workstationId = config.options.workstationId;
      }
      if (config.options.lowerCaseGuids !== undefined) {
        if (typeof config.options.lowerCaseGuids !== 'boolean') {
          throw new TypeError('The "config.options.lowerCaseGuids" property must be of type boolean.');
        }
        this.config.options.lowerCaseGuids = config.options.lowerCaseGuids;
      }
    }
    this.secureContextOptions = this.config.options.cryptoCredentialsDetails;
    if (this.secureContextOptions.secureOptions === undefined) {
      // If the caller has not specified their own `secureOptions`,
      // we set `SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS` here.
      // Older SQL Server instances running on older Windows versions have
      // trouble with the BEAST workaround in OpenSSL.
      // As BEAST is a browser specific exploit, we can just disable this option here.
      this.secureContextOptions = Object.create(this.secureContextOptions, {
        secureOptions: {
          value: _constants.default.SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS
        }
      });
    }
    this.debug = this.createDebug();
    this.inTransaction = false;
    this.transactionDescriptors = [Buffer.from([0, 0, 0, 0, 0, 0, 0, 0])];

    // 'beginTransaction', 'commitTransaction' and 'rollbackTransaction'
    // events are utilized to maintain inTransaction property state which in
    // turn is used in managing transactions. These events are only fired for
    // TDS version 7.2 and beyond. The properties below are used to emulate
    // equivalent behavior for TDS versions before 7.2.
    this.transactionDepth = 0;
    this.isSqlBatch = false;
    this.closed = false;
    this.messageBuffer = Buffer.alloc(0);
    this.curTransientRetryCount = 0;
    this.transientErrorLookup = new _transientErrorLookup.TransientErrorLookup();
    this.state = this.STATE.INITIALIZED;
    this.attentionSent = false;
    this._cancelAfterRequestSent = () => {
      this.messageIo.sendMessage(_packet.TYPE.ATTENTION);
      this.attentionSent = true;
      this.createCancelTimer();
    };
    this._onSocketClose = () => {
      this.socketClose();
    };
    this._onSocketEnd = () => {
      this.socketEnd();
    };
    this._onSocketError = error => {
      this.dispatchEvent('socketError', error);
      process.nextTick(() => {
        this.emit('error', this.wrapSocketError(error));
      });
    };
  }
  connect(connectListener) {
    if (this.state !== this.STATE.INITIALIZED) {
      throw new _errors.ConnectionError('`.connect` can not be called on a Connection in `' + this.state.name + '` state.');
    }
    if (connectListener) {
      const onConnect = err => {
        this.removeListener('error', onError);
        connectListener(err);
      };
      const onError = err => {
        this.removeListener('connect', onConnect);
        connectListener(err);
      };
      this.once('connect', onConnect);
      this.once('error', onError);
    }
    this.transitionTo(this.STATE.CONNECTING);
    this.initialiseConnection().then(() => {
      process.nextTick(() => {
        this.emit('connect');
      });
    }, err => {
      this.transitionTo(this.STATE.FINAL);
      this.closed = true;
      process.nextTick(() => {
        this.emit('connect', err);
      });
      process.nextTick(() => {
        this.emit('end');
      });
    });
  }

  /**
   * The server has reported that the charset has changed.
   */

  /**
   * The attempt to connect and validate has completed.
   */

  /**
   * The server has reported that the active database has changed.
   * This may be as a result of a successful login, or a `use` statement.
   */

  /**
   * A debug message is available. It may be logged or ignored.
   */

  /**
   * Internal error occurs.
   */

  /**
   * The server has issued an error message.
   */

  /**
   * The connection has ended.
   *
   * This may be as a result of the client calling [[close]], the server
   * closing the connection, or a network error.
   */

  /**
   * The server has issued an information message.
   */

  /**
   * The server has reported that the language has changed.
   */

  /**
   * The connection was reset.
   */

  /**
   * A secure connection has been established.
   */

  on(event, listener) {
    return super.on(event, listener);
  }

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  /**
   * @private
   */

  emit(event, ...args) {
    return super.emit(event, ...args);
  }

  /**
   * Closes the connection to the database.
   *
   * The [[Event_end]] will be emitted once the connection has been closed.
   */
  close() {
    this.transitionTo(this.STATE.FINAL);
    this.cleanupConnection();
  }

  /**
   * @private
   */
  async initialiseConnection() {
    const timeoutController = new AbortController();
    const connectTimer = setTimeout(() => {
      const hostPostfix = this.config.options.port ? `:${this.config.options.port}` : `\\${this.config.options.instanceName}`;
      // If we have routing data stored, this connection has been redirected
      const server = this.routingData ? this.routingData.server : this.config.server;
      const port = this.routingData ? `:${this.routingData.port}` : hostPostfix;
      // Grab the target host from the connection configuration, and from a redirect message
      // otherwise, leave the message empty.
      const routingMessage = this.routingData ? ` (redirected from ${this.config.server}${hostPostfix})` : '';
      const message = `Failed to connect to ${server}${port}${routingMessage} in ${this.config.options.connectTimeout}ms`;
      this.debug.log(message);
      timeoutController.abort(new _errors.ConnectionError(message, 'ETIMEOUT'));
    }, this.config.options.connectTimeout);
    try {
      let signal = timeoutController.signal;
      let port = this.config.options.port;
      if (!port) {
        try {
          port = await (0, _instanceLookup.instanceLookup)({
            server: this.config.server,
            instanceName: this.config.options.instanceName,
            timeout: this.config.options.connectTimeout,
            signal: signal
          });
        } catch (err) {
          signal.throwIfAborted();
          throw new _errors.ConnectionError(err.message, 'EINSTLOOKUP', {
            cause: err
          });
        }
      }
      let socket;
      try {
        socket = await this.connectOnPort(port, this.config.options.multiSubnetFailover, signal, this.config.options.connector);
      } catch (err) {
        signal.throwIfAborted();
        throw this.wrapSocketError(err);
      }
      try {
        const controller = new AbortController();
        const onError = err => {
          controller.abort(this.wrapSocketError(err));
        };
        const onClose = () => {
          this.debug.log('connection to ' + this.config.server + ':' + this.config.options.port + ' closed');
        };
        const onEnd = () => {
          this.debug.log('socket ended');
          const error = new Error('socket hang up');
          error.code = 'ECONNRESET';
          controller.abort(this.wrapSocketError(error));
        };
        socket.once('error', onError);
        socket.once('close', onClose);
        socket.once('end', onEnd);
        try {
          signal = AbortSignal.any([signal, controller.signal]);
          socket.setKeepAlive(true, KEEP_ALIVE_INITIAL_DELAY);
          this.messageIo = new _messageIo.default(socket, this.config.options.packetSize, this.debug);
          this.messageIo.on('secure', cleartext => {
            this.emit('secure', cleartext);
          });
          this.socket = socket;
          this.closed = false;
          this.debug.log('connected to ' + this.config.server + ':' + this.config.options.port);
          this.sendPreLogin();
          this.transitionTo(this.STATE.SENT_PRELOGIN);
          const preloginResponse = await this.readPreloginResponse(signal);
          await this.performTlsNegotiation(preloginResponse, signal);
          this.sendLogin7Packet();
          try {
            const {
              authentication
            } = this.config;
            switch (authentication.type) {
              case 'token-credential':
              case 'azure-active-directory-password':
              case 'azure-active-directory-msi-vm':
              case 'azure-active-directory-msi-app-service':
              case 'azure-active-directory-service-principal-secret':
              case 'azure-active-directory-default':
                this.transitionTo(this.STATE.SENT_LOGIN7_WITH_FEDAUTH);
                this.routingData = await this.performSentLogin7WithFedAuth(signal);
                break;
              case 'ntlm':
                this.transitionTo(this.STATE.SENT_LOGIN7_WITH_NTLM);
                this.routingData = await this.performSentLogin7WithNTLMLogin(signal);
                break;
              default:
                this.transitionTo(this.STATE.SENT_LOGIN7_WITH_STANDARD_LOGIN);
                this.routingData = await this.performSentLogin7WithStandardLogin(signal);
                break;
            }
          } catch (err) {
            if (isTransientError(err)) {
              this.debug.log('Initiating retry on transient error');
              this.transitionTo(this.STATE.TRANSIENT_FAILURE_RETRY);
              return await this.performTransientFailureRetry();
            }
            throw err;
          }

          // If routing data is present, we need to re-route the connection
          if (this.routingData) {
            this.transitionTo(this.STATE.REROUTING);
            return await this.performReRouting();
          }
          this.transitionTo(this.STATE.LOGGED_IN_SENDING_INITIAL_SQL);
          await this.performLoggedInSendingInitialSql(signal);
        } finally {
          socket.removeListener('error', onError);
          socket.removeListener('close', onClose);
          socket.removeListener('end', onEnd);
        }
      } catch (err) {
        socket.destroy();
        throw err;
      }
      socket.on('error', this._onSocketError);
      socket.on('close', this._onSocketClose);
      socket.on('end', this._onSocketEnd);
      this.transitionTo(this.STATE.LOGGED_IN);
    } finally {
      clearTimeout(connectTimer);
    }
  }

  /**
   * @private
   */
  cleanupConnection() {
    if (!this.closed) {
      this.clearRequestTimer();
      this.clearCancelTimer();
      this.closeConnection();
      process.nextTick(() => {
        this.emit('end');
      });
      const request = this.request;
      if (request) {
        const err = new _errors.RequestError('Connection closed before request completed.', 'ECLOSE');
        request.callback(err);
        this.request = undefined;
      }
      this.attentionSent = false;
      this.closed = true;
    }
  }

  /**
   * @private
   */
  createDebug() {
    const debug = new _debug.default(this.config.options.debug);
    debug.on('debug', message => {
      this.emit('debug', message);
    });
    return debug;
  }

  /**
   * @private
   */
  createTokenStreamParser(message, handler) {
    return new _tokenStreamParser.Parser(message, this.debug, handler, this.config.options);
  }
  async wrapWithTls(socket, signal) {
    signal.throwIfAborted();
    const secureContext = tls.createSecureContext(this.secureContextOptions);
    // If connect to an ip address directly,
    // need to set the servername to an empty string
    // if the user has not given a servername explicitly
    const serverName = !net.isIP(this.config.server) ? this.config.server : '';
    const encryptOptions = {
      host: this.config.server,
      socket: socket,
      ALPNProtocols: ['tds/8.0'],
      secureContext: secureContext,
      servername: this.config.options.serverName ? this.config.options.serverName : serverName
    };
    const {
      promise,
      resolve,
      reject
    } = withResolvers();
    const encryptsocket = tls.connect(encryptOptions);
    try {
      const onAbort = () => {
        reject(signal.reason);
      };
      signal.addEventListener('abort', onAbort, {
        once: true
      });
      try {
        const onError = reject;
        const onConnect = () => {
          resolve(encryptsocket);
        };
        encryptsocket.once('error', onError);
        encryptsocket.once('secureConnect', onConnect);
        try {
          return await promise;
        } finally {
          encryptsocket.removeListener('error', onError);
          encryptsocket.removeListener('connect', onConnect);
        }
      } finally {
        signal.removeEventListener('abort', onAbort);
      }
    } catch (err) {
      encryptsocket.destroy();
      throw err;
    }
  }
  async connectOnPort(port, multiSubnetFailover, signal, customConnector) {
    const connectOpts = {
      host: this.routingData ? this.routingData.server : this.config.server,
      port: this.routingData ? this.routingData.port : port,
      localAddress: this.config.options.localAddress
    };
    const connect = customConnector || (multiSubnetFailover ? _connector.connectInParallel : _connector.connectInSequence);
    let socket = await connect(connectOpts, _dns.default.lookup, signal);
    if (this.config.options.encrypt === 'strict') {
      try {
        // Wrap the socket with TLS for TDS 8.0
        socket = await this.wrapWithTls(socket, signal);
      } catch (err) {
        socket.end();
        throw err;
      }
    }
    return socket;
  }

  /**
   * @private
   */
  closeConnection() {
    if (this.socket) {
      this.socket.destroy();
    }
  }

  /**
   * @private
   */
  createCancelTimer() {
    this.clearCancelTimer();
    const timeout = this.config.options.cancelTimeout;
    if (timeout > 0) {
      this.cancelTimer = setTimeout(() => {
        this.cancelTimeout();
      }, timeout);
    }
  }

  /**
   * @private
   */
  createRequestTimer() {
    this.clearRequestTimer(); // release old timer, just to be safe
    const request = this.request;
    const timeout = request.timeout !== undefined ? request.timeout : this.config.options.requestTimeout;
    if (timeout) {
      this.requestTimer = setTimeout(() => {
        this.requestTimeout();
      }, timeout);
    }
  }

  /**
   * @private
   */
  cancelTimeout() {
    const message = `Failed to cancel request in ${this.config.options.cancelTimeout}ms`;
    this.debug.log(message);
    this.dispatchEvent('socketError', new _errors.ConnectionError(message, 'ETIMEOUT'));
  }

  /**
   * @private
   */
  requestTimeout() {
    this.requestTimer = undefined;
    const request = this.request;
    request.cancel();
    const timeout = request.timeout !== undefined ? request.timeout : this.config.options.requestTimeout;
    const message = 'Timeout: Request failed to complete in ' + timeout + 'ms';
    request.error = new _errors.RequestError(message, 'ETIMEOUT');
  }

  /**
   * @private
   */
  clearCancelTimer() {
    if (this.cancelTimer) {
      clearTimeout(this.cancelTimer);
      this.cancelTimer = undefined;
    }
  }

  /**
   * @private
   */
  clearRequestTimer() {
    if (this.requestTimer) {
      clearTimeout(this.requestTimer);
      this.requestTimer = undefined;
    }
  }

  /**
   * @private
   */
  transitionTo(newState) {
    if (this.state === newState) {
      this.debug.log('State is already ' + newState.name);
      return;
    }
    if (this.state && this.state.exit) {
      this.state.exit.call(this, newState);
    }
    this.debug.log('State change: ' + (this.state ? this.state.name : 'undefined') + ' -> ' + newState.name);
    this.state = newState;
    if (this.state.enter) {
      this.state.enter.apply(this);
    }
  }

  /**
   * @private
   */
  getEventHandler(eventName) {
    const handler = this.state.events[eventName];
    if (!handler) {
      throw new Error(`No event '${eventName}' in state '${this.state.name}'`);
    }
    return handler;
  }

  /**
   * @private
   */
  dispatchEvent(eventName, ...args) {
    const handler = this.state.events[eventName];
    if (handler) {
      handler.apply(this, args);
    } else {
      this.emit('error', new Error(`No event '${eventName}' in state '${this.state.name}'`));
      this.close();
    }
  }

  /**
   * @private
   */
  wrapSocketError(error) {
    if (this.state === this.STATE.CONNECTING || this.state === this.STATE.SENT_TLSSSLNEGOTIATION) {
      const hostPostfix = this.config.options.port ? `:${this.config.options.port}` : `\\${this.config.options.instanceName}`;
      // If we have routing data stored, this connection has been redirected
      const server = this.routingData ? this.routingData.server : this.config.server;
      const port = this.routingData ? `:${this.routingData.port}` : hostPostfix;
      // Grab the target host from the connection configuration, and from a redirect message
      // otherwise, leave the message empty.
      const routingMessage = this.routingData ? ` (redirected from ${this.config.server}${hostPostfix})` : '';
      const message = `Failed to connect to ${server}${port}${routingMessage} - ${error.message}`;
      return new _errors.ConnectionError(message, 'ESOCKET', {
        cause: error
      });
    } else {
      const message = `Connection lost - ${error.message}`;
      return new _errors.ConnectionError(message, 'ESOCKET', {
        cause: error
      });
    }
  }

  /**
   * @private
   */
  socketEnd() {
    this.debug.log('socket ended');
    if (this.state !== this.STATE.FINAL) {
      const error = new Error('socket hang up');
      error.code = 'ECONNRESET';
      this.dispatchEvent('socketError', error);
      process.nextTick(() => {
        this.emit('error', this.wrapSocketError(error));
      });
    }
  }

  /**
   * @private
   */
  socketClose() {
    this.debug.log('connection to ' + this.config.server + ':' + this.config.options.port + ' closed');
    this.transitionTo(this.STATE.FINAL);
    this.cleanupConnection();
  }

  /**
   * @private
   */
  sendPreLogin() {
    const [, major, minor, build] = /^(\d+)\.(\d+)\.(\d+)/.exec(_package.version) ?? ['0.0.0', '0', '0', '0'];
    const payload = new _preloginPayload.default({
      // If encrypt setting is set to 'strict', then we should have already done the encryption before calling
      // this function. Therefore, the encrypt will be set to false here.
      // Otherwise, we will set encrypt here based on the encrypt Boolean value from the configuration.
      encrypt: typeof this.config.options.encrypt === 'boolean' && this.config.options.encrypt,
      version: {
        major: Number(major),
        minor: Number(minor),
        build: Number(build),
        subbuild: 0
      }
    });
    this.messageIo.sendMessage(_packet.TYPE.PRELOGIN, payload.data);
    this.debug.payload(function () {
      return payload.toString('  ');
    });
  }

  /**
   * @private
   */
  sendLogin7Packet() {
    const payload = new _login7Payload.default({
      tdsVersion: _tdsVersions.versions[this.config.options.tdsVersion],
      packetSize: this.config.options.packetSize,
      clientProgVer: 0,
      clientPid: process.pid,
      connectionId: 0,
      clientTimeZone: new Date().getTimezoneOffset(),
      clientLcid: 0x00000409
    });
    const {
      authentication
    } = this.config;
    switch (authentication.type) {
      case 'azure-active-directory-password':
        payload.fedAuth = {
          type: 'ADAL',
          echo: this.fedAuthRequired,
          workflow: 'default'
        };
        break;
      case 'azure-active-directory-access-token':
        payload.fedAuth = {
          type: 'SECURITYTOKEN',
          echo: this.fedAuthRequired,
          fedAuthToken: authentication.options.token
        };
        break;
      case 'token-credential':
      case 'azure-active-directory-msi-vm':
      case 'azure-active-directory-default':
      case 'azure-active-directory-msi-app-service':
      case 'azure-active-directory-service-principal-secret':
        payload.fedAuth = {
          type: 'ADAL',
          echo: this.fedAuthRequired,
          workflow: 'integrated'
        };
        break;
      case 'ntlm':
        payload.sspi = (0, _ntlm.createNTLMRequest)({
          domain: authentication.options.domain
        });
        break;
      default:
        payload.userName = authentication.options.userName;
        payload.password = authentication.options.password;
    }
    payload.hostname = this.config.options.workstationId || _os.default.hostname();
    payload.serverName = this.routingData ? `${this.routingData.server}${this.routingData.instance ? '\\' + this.routingData.instance : ''}` : this.config.server;
    payload.appName = this.config.options.appName || 'Tedious';
    payload.libraryName = _library.name;
    payload.language = this.config.options.language;
    payload.database = this.config.options.database;
    payload.clientId = Buffer.from([1, 2, 3, 4, 5, 6]);
    payload.readOnlyIntent = this.config.options.readOnlyIntent;
    payload.initDbFatal = !this.config.options.fallbackToDefaultDb;
    this.routingData = undefined;
    this.messageIo.sendMessage(_packet.TYPE.LOGIN7, payload.toBuffer());
    this.debug.payload(function () {
      return payload.toString('  ');
    });
  }

  /**
   * @private
   */
  sendFedAuthTokenMessage(token) {
    const accessTokenLen = Buffer.byteLength(token, 'ucs2');
    const data = Buffer.alloc(8 + accessTokenLen);
    let offset = 0;
    offset = data.writeUInt32LE(accessTokenLen + 4, offset);
    offset = data.writeUInt32LE(accessTokenLen, offset);
    data.write(token, offset, 'ucs2');
    this.messageIo.sendMessage(_packet.TYPE.FEDAUTH_TOKEN, data);
  }

  /**
   * @private
   */
  sendInitialSql() {
    const payload = new _sqlbatchPayload.default(this.getInitialSql(), this.currentTransactionDescriptor(), this.config.options);
    const message = new _message.default({
      type: _packet.TYPE.SQL_BATCH
    });
    this.messageIo.outgoingMessageStream.write(message);
    _stream.Readable.from(payload).pipe(message);
  }

  /**
   * @private
   */
  getInitialSql() {
    const options = [];
    if (this.config.options.enableAnsiNull === true) {
      options.push('set ansi_nulls on');
    } else if (this.config.options.enableAnsiNull === false) {
      options.push('set ansi_nulls off');
    }
    if (this.config.options.enableAnsiNullDefault === true) {
      options.push('set ansi_null_dflt_on on');
    } else if (this.config.options.enableAnsiNullDefault === false) {
      options.push('set ansi_null_dflt_on off');
    }
    if (this.config.options.enableAnsiPadding === true) {
      options.push('set ansi_padding on');
    } else if (this.config.options.enableAnsiPadding === false) {
      options.push('set ansi_padding off');
    }
    if (this.config.options.enableAnsiWarnings === true) {
      options.push('set ansi_warnings on');
    } else if (this.config.options.enableAnsiWarnings === false) {
      options.push('set ansi_warnings off');
    }
    if (this.config.options.enableArithAbort === true) {
      options.push('set arithabort on');
    } else if (this.config.options.enableArithAbort === false) {
      options.push('set arithabort off');
    }
    if (this.config.options.enableConcatNullYieldsNull === true) {
      options.push('set concat_null_yields_null on');
    } else if (this.config.options.enableConcatNullYieldsNull === false) {
      options.push('set concat_null_yields_null off');
    }
    if (this.config.options.enableCursorCloseOnCommit === true) {
      options.push('set cursor_close_on_commit on');
    } else if (this.config.options.enableCursorCloseOnCommit === false) {
      options.push('set cursor_close_on_commit off');
    }
    if (this.config.options.datefirst !== null) {
      options.push(`set datefirst ${this.config.options.datefirst}`);
    }
    if (this.config.options.dateFormat !== null) {
      options.push(`set dateformat ${this.config.options.dateFormat}`);
    }
    if (this.config.options.enableImplicitTransactions === true) {
      options.push('set implicit_transactions on');
    } else if (this.config.options.enableImplicitTransactions === false) {
      options.push('set implicit_transactions off');
    }
    if (this.config.options.language !== null) {
      options.push(`set language ${this.config.options.language}`);
    }
    if (this.config.options.enableNumericRoundabort === true) {
      options.push('set numeric_roundabort on');
    } else if (this.config.options.enableNumericRoundabort === false) {
      options.push('set numeric_roundabort off');
    }
    if (this.config.options.enableQuotedIdentifier === true) {
      options.push('set quoted_identifier on');
    } else if (this.config.options.enableQuotedIdentifier === false) {
      options.push('set quoted_identifier off');
    }
    if (this.config.options.textsize !== null) {
      options.push(`set textsize ${this.config.options.textsize}`);
    }
    if (this.config.options.connectionIsolationLevel !== null) {
      options.push(`set transaction isolation level ${this.getIsolationLevelText(this.config.options.connectionIsolationLevel)}`);
    }
    if (this.config.options.abortTransactionOnError === true) {
      options.push('set xact_abort on');
    } else if (this.config.options.abortTransactionOnError === false) {
      options.push('set xact_abort off');
    }
    return options.join('\n');
  }

  /**
   * Execute the SQL batch represented by [[Request]].
   * There is no param support, and unlike [[Request.execSql]],
   * it is not likely that SQL Server will reuse the execution plan it generates for the SQL.
   *
   * In almost all cases, [[Request.execSql]] will be a better choice.
   *
   * @param request A [[Request]] object representing the request.
   */
  execSqlBatch(request) {
    this.makeRequest(request, _packet.TYPE.SQL_BATCH, new _sqlbatchPayload.default(request.sqlTextOrProcedure, this.currentTransactionDescriptor(), this.config.options));
  }

  /**
   *  Execute the SQL represented by [[Request]].
   *
   * As `sp_executesql` is used to execute the SQL, if the same SQL is executed multiples times
   * using this function, the SQL Server query optimizer is likely to reuse the execution plan it generates
   * for the first execution. This may also result in SQL server treating the request like a stored procedure
   * which can result in the [[Event_doneInProc]] or [[Event_doneProc]] events being emitted instead of the
   * [[Event_done]] event you might expect. Using [[execSqlBatch]] will prevent this from occurring but may have a negative performance impact.
   *
   * Beware of the way that scoping rules apply, and how they may [affect local temp tables](http://weblogs.sqlteam.com/mladenp/archive/2006/11/03/17197.aspx)
   * If you're running in to scoping issues, then [[execSqlBatch]] may be a better choice.
   * See also [issue #24](https://github.com/pekim/tedious/issues/24)
   *
   * @param request A [[Request]] object representing the request.
   */
  execSql(request) {
    try {
      request.validateParameters(this.databaseCollation);
    } catch (error) {
      request.error = error;
      process.nextTick(() => {
        this.debug.log(error.message);
        request.callback(error);
      });
      return;
    }
    const parameters = [];
    parameters.push({
      type: _dataType.TYPES.NVarChar,
      name: 'statement',
      value: request.sqlTextOrProcedure,
      output: false,
      length: undefined,
      precision: undefined,
      scale: undefined
    });
    if (request.parameters.length) {
      parameters.push({
        type: _dataType.TYPES.NVarChar,
        name: 'params',
        value: request.makeParamsParameter(request.parameters),
        output: false,
        length: undefined,
        precision: undefined,
        scale: undefined
      });
      parameters.push(...request.parameters);
    }
    this.makeRequest(request, _packet.TYPE.RPC_REQUEST, new _rpcrequestPayload.default(_specialStoredProcedure.default.Sp_ExecuteSql, parameters, this.currentTransactionDescriptor(), this.config.options, this.databaseCollation));
  }

  /**
   * Creates a new BulkLoad instance.
   *
   * @param table The name of the table to bulk-insert into.
   * @param options A set of bulk load options.
   */

  newBulkLoad(table, callbackOrOptions, callback) {
    let options;
    if (callback === undefined) {
      callback = callbackOrOptions;
      options = {};
    } else {
      options = callbackOrOptions;
    }
    if (typeof options !== 'object') {
      throw new TypeError('"options" argument must be an object');
    }
    return new _bulkLoad.default(table, this.databaseCollation, this.config.options, options, callback);
  }

  /**
   * Execute a [[BulkLoad]].
   *
   * ```js
   * // We want to perform a bulk load into a table with the following format:
   * // CREATE TABLE employees (first_name nvarchar(255), last_name nvarchar(255), day_of_birth date);
   *
   * const bulkLoad = connection.newBulkLoad('employees', (err, rowCount) => {
   *   // ...
   * });
   *
   * // First, we need to specify the columns that we want to write to,
   * // and their definitions. These definitions must match the actual table,
   * // otherwise the bulk load will fail.
   * bulkLoad.addColumn('first_name', TYPES.NVarchar, { nullable: false });
   * bulkLoad.addColumn('last_name', TYPES.NVarchar, { nullable: false });
   * bulkLoad.addColumn('date_of_birth', TYPES.Date, { nullable: false });
   *
   * // Execute a bulk load with a predefined list of rows.
   * //
   * // Note that these rows are held in memory until the
   * // bulk load was performed, so if you need to write a large
   * // number of rows (e.g. by reading from a CSV file),
   * // passing an `AsyncIterable` is advisable to keep memory usage low.
   * connection.execBulkLoad(bulkLoad, [
   *   { 'first_name': 'Steve', 'last_name': 'Jobs', 'day_of_birth': new Date('02-24-1955') },
   *   { 'first_name': 'Bill', 'last_name': 'Gates', 'day_of_birth': new Date('10-28-1955') }
   * ]);
   * ```
   *
   * @param bulkLoad A previously created [[BulkLoad]].
   * @param rows A [[Iterable]] or [[AsyncIterable]] that contains the rows that should be bulk loaded.
   */

  execBulkLoad(bulkLoad, rows) {
    bulkLoad.executionStarted = true;
    if (rows) {
      if (bulkLoad.streamingMode) {
        throw new Error("Connection.execBulkLoad can't be called with a BulkLoad that was put in streaming mode.");
      }
      if (bulkLoad.firstRowWritten) {
        throw new Error("Connection.execBulkLoad can't be called with a BulkLoad that already has rows written to it.");
      }
      const rowStream = _stream.Readable.from(rows);

      // Destroy the packet transform if an error happens in the row stream,
      // e.g. if an error is thrown from within a generator or stream.
      rowStream.on('error', err => {
        bulkLoad.rowToPacketTransform.destroy(err);
      });

      // Destroy the row stream if an error happens in the packet transform,
      // e.g. if the bulk load is cancelled.
      bulkLoad.rowToPacketTransform.on('error', err => {
        rowStream.destroy(err);
      });
      rowStream.pipe(bulkLoad.rowToPacketTransform);
    } else if (!bulkLoad.streamingMode) {
      // If the bulkload was not put into streaming mode by the user,
      // we end the rowToPacketTransform here for them.
      //
      // If it was put into streaming mode, it's the user's responsibility
      // to end the stream.
      bulkLoad.rowToPacketTransform.end();
    }
    const onCancel = () => {
      request.cancel();
    };
    const payload = new _bulkLoadPayload.BulkLoadPayload(bulkLoad);
    const request = new _request.default(bulkLoad.getBulkInsertSql(), error => {
      bulkLoad.removeListener('cancel', onCancel);
      if (error) {
        if (error.code === 'UNKNOWN') {
          error.message += ' This is likely because the schema of the BulkLoad does not match the schema of the table you are attempting to insert into.';
        }
        bulkLoad.error = error;
        bulkLoad.callback(error);
        return;
      }
      this.makeRequest(bulkLoad, _packet.TYPE.BULK_LOAD, payload);
    });
    bulkLoad.once('cancel', onCancel);
    this.execSqlBatch(request);
  }

  /**
   * Prepare the SQL represented by the request.
   *
   * The request can then be used in subsequent calls to
   * [[execute]] and [[unprepare]]
   *
   * @param request A [[Request]] object representing the request.
   *   Parameters only require a name and type. Parameter values are ignored.
   */
  prepare(request) {
    const parameters = [];
    parameters.push({
      type: _dataType.TYPES.Int,
      name: 'handle',
      value: undefined,
      output: true,
      length: undefined,
      precision: undefined,
      scale: undefined
    });
    parameters.push({
      type: _dataType.TYPES.NVarChar,
      name: 'params',
      value: request.parameters.length ? request.makeParamsParameter(request.parameters) : null,
      output: false,
      length: undefined,
      precision: undefined,
      scale: undefined
    });
    parameters.push({
      type: _dataType.TYPES.NVarChar,
      name: 'stmt',
      value: request.sqlTextOrProcedure,
      output: false,
      length: undefined,
      precision: undefined,
      scale: undefined
    });
    request.preparing = true;

    // TODO: We need to clean up this event handler, otherwise this leaks memory
    request.on('returnValue', (name, value) => {
      if (name === 'handle') {
        request.handle = value;
      } else {
        request.error = new _errors.RequestError(`Tedious > Unexpected output parameter ${name} from sp_prepare`);
      }
    });
    this.makeRequest(request, _packet.TYPE.RPC_REQUEST, new _rpcrequestPayload.default(_specialStoredProcedure.default.Sp_Prepare, parameters, this.currentTransactionDescriptor(), this.config.options, this.databaseCollation));
  }

  /**
   * Release the SQL Server resources associated with a previously prepared request.
   *
   * @param request A [[Request]] object representing the request.
   *   Parameters only require a name and type.
   *   Parameter values are ignored.
   */
  unprepare(request) {
    const parameters = [];
    parameters.push({
      type: _dataType.TYPES.Int,
      name: 'handle',
      // TODO: Abort if `request.handle` is not set
      value: request.handle,
      output: false,
      length: undefined,
      precision: undefined,
      scale: undefined
    });
    this.makeRequest(request, _packet.TYPE.RPC_REQUEST, new _rpcrequestPayload.default(_specialStoredProcedure.default.Sp_Unprepare, parameters, this.currentTransactionDescriptor(), this.config.options, this.databaseCollation));
  }

  /**
   * Execute previously prepared SQL, using the supplied parameters.
   *
   * @param request A previously prepared [[Request]].
   * @param parameters  An object whose names correspond to the names of
   *   parameters that were added to the [[Request]] before it was prepared.
   *   The object's values are passed as the parameters' values when the
   *   request is executed.
   */
  execute(request, parameters) {
    const executeParameters = [];
    executeParameters.push({
      type: _dataType.TYPES.Int,
      name: '',
      // TODO: Abort if `request.handle` is not set
      value: request.handle,
      output: false,
      length: undefined,
      precision: undefined,
      scale: undefined
    });
    try {
      for (let i = 0, len = request.parameters.length; i < len; i++) {
        const parameter = request.parameters[i];
        executeParameters.push({
          ...parameter,
          value: parameter.type.validate(parameters ? parameters[parameter.name] : null, this.databaseCollation)
        });
      }
    } catch (error) {
      request.error = error;
      process.nextTick(() => {
        this.debug.log(error.message);
        request.callback(error);
      });
      return;
    }
    this.makeRequest(request, _packet.TYPE.RPC_REQUEST, new _rpcrequestPayload.default(_specialStoredProcedure.default.Sp_Execute, executeParameters, this.currentTransactionDescriptor(), this.config.options, this.databaseCollation));
  }

  /**
   * Call a stored procedure represented by [[Request]].
   *
   * @param request A [[Request]] object representing the request.
   */
  callProcedure(request) {
    try {
      request.validateParameters(this.databaseCollation);
    } catch (error) {
      request.error = error;
      process.nextTick(() => {
        this.debug.log(error.message);
        request.callback(error);
      });
      return;
    }
    this.makeRequest(request, _packet.TYPE.RPC_REQUEST, new _rpcrequestPayload.default(request.sqlTextOrProcedure, request.parameters, this.currentTransactionDescriptor(), this.config.options, this.databaseCollation));
  }

  /**
   * Start a transaction.
   *
   * @param callback
   * @param name A string representing a name to associate with the transaction.
   *   Optional, and defaults to an empty string. Required when `isolationLevel`
   *   is present.
   * @param isolationLevel The isolation level that the transaction is to be run with.
   *
   *   The isolation levels are available from `require('tedious').ISOLATION_LEVEL`.
   *   * `READ_UNCOMMITTED`
   *   * `READ_COMMITTED`
   *   * `REPEATABLE_READ`
   *   * `SERIALIZABLE`
   *   * `SNAPSHOT`
   *
   *   Optional, and defaults to the Connection's isolation level.
   */
  beginTransaction(callback, name = '', isolationLevel = this.config.options.isolationLevel) {
    (0, _transaction.assertValidIsolationLevel)(isolationLevel, 'isolationLevel');
    const transaction = new _transaction.Transaction(name, isolationLevel);
    if (this.config.options.tdsVersion < '7_2') {
      return this.execSqlBatch(new _request.default('SET TRANSACTION ISOLATION LEVEL ' + transaction.isolationLevelToTSQL() + ';BEGIN TRAN ' + transaction.name, err => {
        this.transactionDepth++;
        if (this.transactionDepth === 1) {
          this.inTransaction = true;
        }
        callback(err);
      }));
    }
    const request = new _request.default(undefined, err => {
      return callback(err, this.currentTransactionDescriptor());
    });
    return this.makeRequest(request, _packet.TYPE.TRANSACTION_MANAGER, transaction.beginPayload(this.currentTransactionDescriptor()));
  }

  /**
   * Commit a transaction.
   *
   * There should be an active transaction - that is, [[beginTransaction]]
   * should have been previously called.
   *
   * @param callback
   * @param name A string representing a name to associate with the transaction.
   *   Optional, and defaults to an empty string. Required when `isolationLevel`is present.
   */
  commitTransaction(callback, name = '') {
    const transaction = new _transaction.Transaction(name);
    if (this.config.options.tdsVersion < '7_2') {
      return this.execSqlBatch(new _request.default('COMMIT TRAN ' + transaction.name, err => {
        this.transactionDepth--;
        if (this.transactionDepth === 0) {
          this.inTransaction = false;
        }
        callback(err);
      }));
    }
    const request = new _request.default(undefined, callback);
    return this.makeRequest(request, _packet.TYPE.TRANSACTION_MANAGER, transaction.commitPayload(this.currentTransactionDescriptor()));
  }

  /**
   * Rollback a transaction.
   *
   * There should be an active transaction - that is, [[beginTransaction]]
   * should have been previously called.
   *
   * @param callback
   * @param name A string representing a name to associate with the transaction.
   *   Optional, and defaults to an empty string.
   *   Required when `isolationLevel` is present.
   */
  rollbackTransaction(callback, name = '') {
    const transaction = new _transaction.Transaction(name);
    if (this.config.options.tdsVersion < '7_2') {
      return this.execSqlBatch(new _request.default('ROLLBACK TRAN ' + transaction.name, err => {
        this.transactionDepth--;
        if (this.transactionDepth === 0) {
          this.inTransaction = false;
        }
        callback(err);
      }));
    }
    const request = new _request.default(undefined, callback);
    return this.makeRequest(request, _packet.TYPE.TRANSACTION_MANAGER, transaction.rollbackPayload(this.currentTransactionDescriptor()));
  }

  /**
   * Set a savepoint within a transaction.
   *
   * There should be an active transaction - that is, [[beginTransaction]]
   * should have been previously called.
   *
   * @param callback
   * @param name A string representing a name to associate with the transaction.\
   *   Optional, and defaults to an empty string.
   *   Required when `isolationLevel` is present.
   */
  saveTransaction(callback, name) {
    const transaction = new _transaction.Transaction(name);
    if (this.config.options.tdsVersion < '7_2') {
      return this.execSqlBatch(new _request.default('SAVE TRAN ' + transaction.name, err => {
        this.transactionDepth++;
        callback(err);
      }));
    }
    const request = new _request.default(undefined, callback);
    return this.makeRequest(request, _packet.TYPE.TRANSACTION_MANAGER, transaction.savePayload(this.currentTransactionDescriptor()));
  }

  /**
   * Run the given callback after starting a transaction, and commit or
   * rollback the transaction afterwards.
   *
   * This is a helper that employs [[beginTransaction]], [[commitTransaction]],
   * [[rollbackTransaction]], and [[saveTransaction]] to greatly simplify the
   * use of database transactions and automatically handle transaction nesting.
   *
   * @param cb
   * @param isolationLevel
   *   The isolation level that the transaction is to be run with.
   *
   *   The isolation levels are available from `require('tedious').ISOLATION_LEVEL`.
   *   * `READ_UNCOMMITTED`
   *   * `READ_COMMITTED`
   *   * `REPEATABLE_READ`
   *   * `SERIALIZABLE`
   *   * `SNAPSHOT`
   *
   *   Optional, and defaults to the Connection's isolation level.
   */
  transaction(cb, isolationLevel) {
    if (typeof cb !== 'function') {
      throw new TypeError('`cb` must be a function');
    }
    const useSavepoint = this.inTransaction;
    const name = '_tedious_' + _crypto.default.randomBytes(10).toString('hex');
    const txDone = (err, done, ...args) => {
      if (err) {
        if (this.inTransaction && this.state === this.STATE.LOGGED_IN) {
          this.rollbackTransaction(txErr => {
            done(txErr || err, ...args);
          }, name);
        } else {
          done(err, ...args);
        }
      } else if (useSavepoint) {
        if (this.config.options.tdsVersion < '7_2') {
          this.transactionDepth--;
        }
        done(null, ...args);
      } else {
        this.commitTransaction(txErr => {
          done(txErr, ...args);
        }, name);
      }
    };
    if (useSavepoint) {
      return this.saveTransaction(err => {
        if (err) {
          return cb(err);
        }
        if (isolationLevel) {
          return this.execSqlBatch(new _request.default('SET transaction isolation level ' + this.getIsolationLevelText(isolationLevel), err => {
            return cb(err, txDone);
          }));
        } else {
          return cb(null, txDone);
        }
      }, name);
    } else {
      return this.beginTransaction(err => {
        if (err) {
          return cb(err);
        }
        return cb(null, txDone);
      }, name, isolationLevel);
    }
  }

  /**
   * @private
   */
  makeRequest(request, packetType, payload) {
    if (this.state !== this.STATE.LOGGED_IN) {
      const message = 'Requests can only be made in the ' + this.STATE.LOGGED_IN.name + ' state, not the ' + this.state.name + ' state';
      this.debug.log(message);
      request.callback(new _errors.RequestError(message, 'EINVALIDSTATE'));
    } else if (request.canceled) {
      process.nextTick(() => {
        request.callback(new _errors.RequestError('Canceled.', 'ECANCEL'));
      });
    } else {
      if (packetType === _packet.TYPE.SQL_BATCH) {
        this.isSqlBatch = true;
      } else {
        this.isSqlBatch = false;
      }
      this.request = request;
      this.attentionSent = false;
      request.connection = this;
      request.rowCount = 0;
      request.rows = [];
      request.rst = [];
      const onCancel = () => {
        payloadStream.unpipe(message);
        payloadStream.destroy();

        // The request error might already be set, e.g. if the payload
        // stream errored before the cancellation.
        request.error ??= new _errors.RequestError('Canceled.', 'ECANCEL');

        // set the ignore bit and end the message.
        message.ignore = true;
        message.end();
        if (request instanceof _request.default && request.paused) {
          // resume the request if it was paused so we can read the remaining tokens
          request.resume();
        }
      };
      request.once('cancel', onCancel);
      this.createRequestTimer();
      const message = new _message.default({
        type: packetType,
        resetConnection: this.resetConnectionOnNextRequest
      });
      this.messageIo.outgoingMessageStream.write(message);
      this.transitionTo(this.STATE.SENT_CLIENT_REQUEST);
      message.once('finish', () => {
        request.removeListener('cancel', onCancel);
        // Prepend the listener so it always runs before the
        // `SentClientRequest` state's `cancel` handler, regardless of the
        // order in which the two were registered. The latter relies on
        // `attentionSent` already being set, which only this listener does.
        request.prependOnceListener('cancel', this._cancelAfterRequestSent);
        this.resetConnectionOnNextRequest = false;
        this.debug.payload(function () {
          return payload.toString('  ');
        });
      });
      const payloadStream = _stream.Readable.from(payload);
      payloadStream.once('error', error => {
        payloadStream.unpipe(message);

        // Only set a request error if no error was set yet.
        request.error ??= error;
        message.ignore = true;
        message.end();
      });
      payloadStream.pipe(message);
    }
  }

  /**
   * Cancel currently executed request.
   */
  cancel() {
    if (!this.request) {
      return false;
    }
    if (this.request.canceled) {
      return false;
    }
    this.request.cancel();
    return true;
  }

  /**
   * Reset the connection to its initial state.
   * Can be useful for connection pool implementations.
   *
   * @param callback
   */
  reset(callback) {
    const request = new _request.default(this.getInitialSql(), err => {
      if (this.config.options.tdsVersion < '7_2') {
        this.inTransaction = false;
      }
      callback(err);
    });
    this.resetConnectionOnNextRequest = true;
    this.execSqlBatch(request);
  }

  /**
   * @private
   */
  currentTransactionDescriptor() {
    return this.transactionDescriptors[this.transactionDescriptors.length - 1];
  }

  /**
   * @private
   */
  getIsolationLevelText(isolationLevel) {
    switch (isolationLevel) {
      case _transaction.ISOLATION_LEVEL.READ_UNCOMMITTED:
        return 'read uncommitted';
      case _transaction.ISOLATION_LEVEL.REPEATABLE_READ:
        return 'repeatable read';
      case _transaction.ISOLATION_LEVEL.SERIALIZABLE:
        return 'serializable';
      case _transaction.ISOLATION_LEVEL.SNAPSHOT:
        return 'snapshot';
      default:
        return 'read committed';
    }
  }

  /**
   * @private
   */
  async performTlsNegotiation(preloginPayload, signal) {
    signal.throwIfAborted();
    const {
      promise: signalAborted,
      reject
    } = withResolvers();
    const onAbort = () => {
      reject(signal.reason);
    };
    signal.addEventListener('abort', onAbort, {
      once: true
    });
    try {
      if (preloginPayload.fedAuthRequired === 1) {
        this.fedAuthRequired = true;
      }
      if ('strict' !== this.config.options.encrypt && (preloginPayload.encryptionString === 'ON' || preloginPayload.encryptionString === 'REQ')) {
        if (!this.config.options.encrypt) {
          throw new _errors.ConnectionError("Server requires encryption, set 'encrypt' config option to true.", 'EENCRYPT');
        }
        this.transitionTo(this.STATE.SENT_TLSSSLNEGOTIATION);
        await Promise.race([this.messageIo.startTls(this.secureContextOptions, this.config.options.serverName ? this.config.options.serverName : this.routingData?.server ?? this.config.server, this.config.options.trustServerCertificate).catch(err => {
          throw this.wrapSocketError(err);
        }), signalAborted]);
      }
    } finally {
      signal.removeEventListener('abort', onAbort);
    }
  }
  async readPreloginResponse(signal) {
    signal.throwIfAborted();
    let messageBuffer = Buffer.alloc(0);
    const {
      promise: signalAborted,
      reject
    } = withResolvers();
    const onAbort = () => {
      reject(signal.reason);
    };
    signal.addEventListener('abort', onAbort, {
      once: true
    });
    try {
      const message = await Promise.race([this.messageIo.readMessage().catch(err => {
        throw this.wrapSocketError(err);
      }), signalAborted]);
      const iterator = message[Symbol.asyncIterator]();
      try {
        while (true) {
          const {
            done,
            value
          } = await Promise.race([iterator.next(), signalAborted]);
          if (done) {
            break;
          }
          messageBuffer = Buffer.concat([messageBuffer, value]);
        }
      } finally {
        if (iterator.return) {
          await iterator.return();
        }
      }
    } finally {
      signal.removeEventListener('abort', onAbort);
    }
    const preloginPayload = new _preloginPayload.default(messageBuffer);
    this.debug.payload(function () {
      return preloginPayload.toString('  ');
    });
    return preloginPayload;
  }

  /**
   * @private
   */
  async performReRouting() {
    this.socket.removeListener('error', this._onSocketError);
    this.socket.removeListener('close', this._onSocketClose);
    this.socket.removeListener('end', this._onSocketEnd);
    this.socket.destroy();
    this.debug.log('connection to ' + this.config.server + ':' + this.config.options.port + ' closed');
    this.emit('rerouting');
    this.debug.log('Rerouting to ' + this.routingData.server + ':' + this.routingData.port);

    // Attempt connecting to the rerouting target
    this.transitionTo(this.STATE.CONNECTING);
    await this.initialiseConnection();
  }

  /**
   * @private
   */
  async performTransientFailureRetry() {
    this.curTransientRetryCount++;
    this.socket.removeListener('error', this._onSocketError);
    this.socket.removeListener('close', this._onSocketClose);
    this.socket.removeListener('end', this._onSocketEnd);
    this.socket.destroy();
    this.debug.log('connection to ' + this.config.server + ':' + this.config.options.port + ' closed');
    const server = this.routingData ? this.routingData.server : this.config.server;
    const port = this.routingData ? this.routingData.port : this.config.options.port;
    this.debug.log('Retry after transient failure connecting to ' + server + ':' + port);
    const {
      promise,
      resolve
    } = withResolvers();
    setTimeout(resolve, this.config.options.connectionRetryInterval);
    await promise;
    this.emit('retry');
    this.transitionTo(this.STATE.CONNECTING);
    await this.initialiseConnection();
  }

  /**
   * @private
   */
  async performSentLogin7WithStandardLogin(signal) {
    signal.throwIfAborted();
    const {
      promise: signalAborted,
      reject
    } = withResolvers();
    const onAbort = () => {
      reject(signal.reason);
    };
    signal.addEventListener('abort', onAbort, {
      once: true
    });
    try {
      const message = await Promise.race([this.messageIo.readMessage().catch(err => {
        throw this.wrapSocketError(err);
      }), signalAborted]);
      const handler = new _handler.Login7TokenHandler(this);
      const tokenStreamParser = this.createTokenStreamParser(message, handler);
      await (0, _events.once)(tokenStreamParser, 'end');
      if (handler.loginAckReceived) {
        return handler.routingData;
      } else if (this.loginError) {
        throw this.loginError;
      } else {
        throw new _errors.ConnectionError('Login failed.', 'ELOGIN');
      }
    } finally {
      this.loginError = undefined;
      signal.removeEventListener('abort', onAbort);
    }
  }

  /**
   * @private
   */
  async performSentLogin7WithNTLMLogin(signal) {
    signal.throwIfAborted();
    const {
      promise: signalAborted,
      reject
    } = withResolvers();
    const onAbort = () => {
      reject(signal.reason);
    };
    signal.addEventListener('abort', onAbort, {
      once: true
    });
    try {
      while (true) {
        const message = await Promise.race([this.messageIo.readMessage().catch(err => {
          throw this.wrapSocketError(err);
        }), signalAborted]);
        const handler = new _handler.Login7TokenHandler(this);
        const tokenStreamParser = this.createTokenStreamParser(message, handler);
        await Promise.race([(0, _events.once)(tokenStreamParser, 'end'), signalAborted]);
        if (handler.loginAckReceived) {
          return handler.routingData;
        } else if (this.ntlmpacket) {
          const authentication = this.config.authentication;
          const payload = new _ntlmPayload.default({
            domain: authentication.options.domain,
            userName: authentication.options.userName,
            password: authentication.options.password,
            ntlmpacket: this.ntlmpacket
          });
          this.messageIo.sendMessage(_packet.TYPE.NTLMAUTH_PKT, payload.data);
          this.debug.payload(function () {
            return payload.toString('  ');
          });
          this.ntlmpacket = undefined;
        } else if (this.loginError) {
          throw this.loginError;
        } else {
          throw new _errors.ConnectionError('Login failed.', 'ELOGIN');
        }
      }
    } finally {
      this.loginError = undefined;
      signal.removeEventListener('abort', onAbort);
    }
  }

  /**
   * @private
   */
  async performSentLogin7WithFedAuth(signal) {
    signal.throwIfAborted();
    const {
      promise: signalAborted,
      reject
    } = withResolvers();
    const onAbort = () => {
      reject(signal.reason);
    };
    signal.addEventListener('abort', onAbort, {
      once: true
    });
    try {
      const message = await Promise.race([this.messageIo.readMessage().catch(err => {
        throw this.wrapSocketError(err);
      }), signalAborted]);
      const handler = new _handler.Login7TokenHandler(this);
      const tokenStreamParser = this.createTokenStreamParser(message, handler);
      await Promise.race([(0, _events.once)(tokenStreamParser, 'end'), signalAborted]);
      if (handler.loginAckReceived) {
        return handler.routingData;
      }
      const fedAuthInfoToken = handler.fedAuthInfoToken;
      if (fedAuthInfoToken && fedAuthInfoToken.stsurl && fedAuthInfoToken.spn) {
        /** Federated authentication configation. */
        const authentication = this.config.authentication;
        /** Permission scope to pass to Entra ID when requesting an authentication token. */
        const tokenScope = new _url.URL('/.default', fedAuthInfoToken.spn).toString();

        /** Instance of the token credential to use to authenticate to the resource. */
        let credentials;
        switch (authentication.type) {
          case 'token-credential':
            credentials = authentication.options.credential;
            break;
          case 'azure-active-directory-password':
            credentials = new _identity.UsernamePasswordCredential(authentication.options.tenantId ?? 'common', authentication.options.clientId, authentication.options.userName, authentication.options.password);
            break;
          case 'azure-active-directory-msi-vm':
          case 'azure-active-directory-msi-app-service':
            const msiArgs = authentication.options.clientId ? [authentication.options.clientId, {}] : [{}];
            credentials = new _identity.ManagedIdentityCredential(...msiArgs);
            break;
          case 'azure-active-directory-default':
            const args = authentication.options.clientId ? {
              managedIdentityClientId: authentication.options.clientId
            } : {};
            credentials = new _identity.DefaultAzureCredential(args);
            break;
          case 'azure-active-directory-service-principal-secret':
            credentials = new _identity.ClientSecretCredential(authentication.options.tenantId, authentication.options.clientId, authentication.options.clientSecret);
            break;
        }

        /** Access token retrieved from Entra ID for the configured permission scope(s). */
        let tokenResponse;
        try {
          tokenResponse = await Promise.race([credentials.getToken(tokenScope), signalAborted]);
        } catch (err) {
          signal.throwIfAborted();
          throw new AggregateError([new _errors.ConnectionError('Security token could not be authenticated or authorized.', 'EFEDAUTH'), err]);
        }

        // Type guard the token value so that it is never null.
        if (tokenResponse === null) {
          throw new AggregateError([new _errors.ConnectionError('Security token could not be authenticated or authorized.', 'EFEDAUTH')]);
        }
        this.sendFedAuthTokenMessage(tokenResponse.token);
        // sent the fedAuth token message, the rest is similar to standard login 7
        this.transitionTo(this.STATE.SENT_LOGIN7_WITH_STANDARD_LOGIN);
        return await this.performSentLogin7WithStandardLogin(signal);
      } else if (this.loginError) {
        throw this.loginError;
      } else {
        throw new _errors.ConnectionError('Login failed.', 'ELOGIN');
      }
    } finally {
      this.loginError = undefined;
      signal.removeEventListener('abort', onAbort);
    }
  }

  /**
   * @private
   */
  async performLoggedInSendingInitialSql(signal) {
    signal.throwIfAborted();
    const {
      promise: signalAborted,
      reject
    } = withResolvers();
    const onAbort = () => {
      reject(signal.reason);
    };
    signal.addEventListener('abort', onAbort, {
      once: true
    });
    try {
      this.sendInitialSql();
      const message = await Promise.race([this.messageIo.readMessage().catch(err => {
        throw this.wrapSocketError(err);
      }), signalAborted]);
      const tokenStreamParser = this.createTokenStreamParser(message, new _handler.InitialSqlTokenHandler(this));
      await Promise.race([(0, _events.once)(tokenStreamParser, 'end'), signalAborted]);
    } finally {
      signal.removeEventListener('abort', onAbort);
    }
  }
}
function isTransientError(error) {
  if (error instanceof AggregateError) {
    error = error.errors[0];
  }
  return error instanceof _errors.ConnectionError && !!error.isTransient;
}
var _default = exports.default = Connection;
module.exports = Connection;
Connection.prototype.STATE = {
  INITIALIZED: {
    name: 'Initialized',
    events: {}
  },
  CONNECTING: {
    name: 'Connecting',
    events: {}
  },
  SENT_PRELOGIN: {
    name: 'SentPrelogin',
    events: {}
  },
  REROUTING: {
    name: 'ReRouting',
    events: {}
  },
  TRANSIENT_FAILURE_RETRY: {
    name: 'TRANSIENT_FAILURE_RETRY',
    events: {}
  },
  SENT_TLSSSLNEGOTIATION: {
    name: 'SentTLSSSLNegotiation',
    events: {}
  },
  SENT_LOGIN7_WITH_STANDARD_LOGIN: {
    name: 'SentLogin7WithStandardLogin',
    events: {}
  },
  SENT_LOGIN7_WITH_NTLM: {
    name: 'SentLogin7WithNTLMLogin',
    events: {}
  },
  SENT_LOGIN7_WITH_FEDAUTH: {
    name: 'SentLogin7WithFedauth',
    events: {}
  },
  LOGGED_IN_SENDING_INITIAL_SQL: {
    name: 'LoggedInSendingInitialSql',
    events: {}
  },
  LOGGED_IN: {
    name: 'LoggedIn',
    events: {
      socketError: function () {
        this.transitionTo(this.STATE.FINAL);
        this.cleanupConnection();
      }
    }
  },
  SENT_CLIENT_REQUEST: {
    name: 'SentClientRequest',
    enter: function () {
      (async () => {
        let message;
        try {
          message = await this.messageIo.readMessage();
        } catch (err) {
          this.dispatchEvent('socketError', err);
          process.nextTick(() => {
            this.emit('error', this.wrapSocketError(err));
          });
          return;
        }
        // request timer is stopped on first data package
        this.clearRequestTimer();
        const tokenStreamParser = this.createTokenStreamParser(message, new _handler.RequestTokenHandler(this, this.request));

        // If the request was canceled after the request message was
        // fully sent off, an attention message was sent to the server.
        //
        // We already started consuming the current message (the response
        // to the canceled request, with all the token handlers being
        // no-ops), and need to ensure the next message (containing the
        // attention acknowledgement) is handled by the `SENT_ATTENTION`
        // state.
        if (this.request?.canceled && this.attentionSent) {
          return this.transitionTo(this.STATE.SENT_ATTENTION);
        }
        const onResume = () => {
          tokenStreamParser.resume();
        };
        const onPause = () => {
          tokenStreamParser.pause();
          this.request?.once('resume', onResume);
        };
        this.request?.on('pause', onPause);
        if (this.request instanceof _request.default && this.request.paused) {
          onPause();
        }
        const onCancel = () => {
          // If the request was canceled before the request message was
          // fully sent, the message was terminated with the `IGNORE` bit
          // set and no attention message was sent. The server's response
          // to the ignored message is handled like a regular response.
          if (!this.attentionSent) {
            return;
          }
          tokenStreamParser.removeListener('end', onEndOfMessage);
          if (this.request instanceof _request.default && this.request.paused) {
            // resume the request if it was paused so we can read the remaining tokens
            this.request.resume();
          }
          this.request?.removeListener('pause', onPause);
          this.request?.removeListener('resume', onResume);

          // The `_cancelAfterRequestSent` callback will have sent a
          // attention message, so now we need to also switch to
          // the `SENT_ATTENTION` state to make sure the attention ack
          // message is processed correctly.
          this.transitionTo(this.STATE.SENT_ATTENTION);
        };
        const onEndOfMessage = () => {
          this.request?.removeListener('cancel', this._cancelAfterRequestSent);
          this.request?.removeListener('cancel', onCancel);
          this.request?.removeListener('pause', onPause);
          this.request?.removeListener('resume', onResume);
          this.transitionTo(this.STATE.LOGGED_IN);
          const sqlRequest = this.request;
          this.request = undefined;
          if (this.config.options.tdsVersion < '7_2' && sqlRequest.error && this.isSqlBatch) {
            this.inTransaction = false;
          }
          sqlRequest.callback(sqlRequest.error, sqlRequest.rowCount, sqlRequest.rows);
        };
        tokenStreamParser.once('end', onEndOfMessage);
        this.request?.once('cancel', onCancel);
      })();
    },
    exit: function (nextState) {
      this.clearRequestTimer();
    },
    events: {
      socketError: function (err) {
        const sqlRequest = this.request;
        this.request = undefined;
        this.transitionTo(this.STATE.FINAL);
        this.cleanupConnection();
        sqlRequest.callback(err);
      }
    }
  },
  SENT_ATTENTION: {
    name: 'SentAttention',
    enter: function () {
      (async () => {
        let message;
        try {
          message = await this.messageIo.readMessage();
        } catch (err) {
          this.dispatchEvent('socketError', err);
          process.nextTick(() => {
            this.emit('error', this.wrapSocketError(err));
          });
          return;
        }
        const handler = new _handler.AttentionTokenHandler(this, this.request);
        const tokenStreamParser = this.createTokenStreamParser(message, handler);
        await (0, _events.once)(tokenStreamParser, 'end');
        // 3.2.5.7 Sent Attention State
        // Discard any data contained in the response, until we receive the attention response
        if (handler.attentionReceived) {
          this.attentionSent = false;
          this.clearCancelTimer();
          const sqlRequest = this.request;
          this.request = undefined;
          this.transitionTo(this.STATE.LOGGED_IN);
          if (sqlRequest.error && sqlRequest.error instanceof _errors.RequestError && sqlRequest.error.code === 'ETIMEOUT') {
            sqlRequest.callback(sqlRequest.error);
          } else {
            sqlRequest.callback(new _errors.RequestError('Canceled.', 'ECANCEL'));
          }
        }
      })().catch(err => {
        process.nextTick(() => {
          throw err;
        });
      });
    },
    events: {
      socketError: function (err) {
        const sqlRequest = this.request;
        this.request = undefined;
        this.transitionTo(this.STATE.FINAL);
        this.cleanupConnection();
        sqlRequest.callback(err);
      }
    }
  },
  FINAL: {
    name: 'Final',
    events: {}
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfY3J5cHRvIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsInJlcXVpcmUiLCJfb3MiLCJ0bHMiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsIm5ldCIsIl9kbnMiLCJfY29uc3RhbnRzIiwiX3N0cmVhbSIsIl9pZGVudGl0eSIsIl9jb3JlQXV0aCIsIl9idWxrTG9hZCIsIl9kZWJ1ZyIsIl9ldmVudHMiLCJfaW5zdGFuY2VMb29rdXAiLCJfdHJhbnNpZW50RXJyb3JMb29rdXAiLCJfcGFja2V0IiwiX3ByZWxvZ2luUGF5bG9hZCIsIl9sb2dpbjdQYXlsb2FkIiwiX250bG1QYXlsb2FkIiwiX3JlcXVlc3QiLCJfcnBjcmVxdWVzdFBheWxvYWQiLCJfc3FsYmF0Y2hQYXlsb2FkIiwiX21lc3NhZ2VJbyIsIl90b2tlblN0cmVhbVBhcnNlciIsIl90cmFuc2FjdGlvbiIsIl9lcnJvcnMiLCJfY29ubmVjdG9yIiwiX2xpYnJhcnkiLCJfdGRzVmVyc2lvbnMiLCJfbWVzc2FnZSIsIl9udGxtIiwiX2RhdGFUeXBlIiwiX2J1bGtMb2FkUGF5bG9hZCIsIl9zcGVjaWFsU3RvcmVkUHJvY2VkdXJlIiwiX3BhY2thZ2UiLCJfdXJsIiwiX2hhbmRsZXIiLCJlIiwidCIsIldlYWtNYXAiLCJyIiwibiIsIl9fZXNNb2R1bGUiLCJvIiwiaSIsImYiLCJfX3Byb3RvX18iLCJkZWZhdWx0IiwiaGFzIiwiZ2V0Iiwic2V0IiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJLRUVQX0FMSVZFX0lOSVRJQUxfREVMQVkiLCJERUZBVUxUX0NPTk5FQ1RfVElNRU9VVCIsIkRFRkFVTFRfQ0xJRU5UX1JFUVVFU1RfVElNRU9VVCIsIkRFRkFVTFRfQ0FOQ0VMX1RJTUVPVVQiLCJERUZBVUxUX0NPTk5FQ1RfUkVUUllfSU5URVJWQUwiLCJERUZBVUxUX1BBQ0tFVF9TSVpFIiwiREVGQVVMVF9URVhUU0laRSIsIkRFRkFVTFRfREFURUZJUlNUIiwiREVGQVVMVF9QT1JUIiwiREVGQVVMVF9URFNfVkVSU0lPTiIsIkRFRkFVTFRfTEFOR1VBR0UiLCJERUZBVUxUX0RBVEVGT1JNQVQiLCJ3aXRoUmVzb2x2ZXJzIiwicmVzb2x2ZSIsInJlamVjdCIsInByb21pc2UiLCJQcm9taXNlIiwicmVzIiwicmVqIiwiQ29ubmVjdGlvbiIsIkV2ZW50RW1pdHRlciIsImNvbnN0cnVjdG9yIiwiY29uZmlnIiwiVHlwZUVycm9yIiwic2VydmVyIiwiZmVkQXV0aFJlcXVpcmVkIiwiYXV0aGVudGljYXRpb24iLCJ1bmRlZmluZWQiLCJ0eXBlIiwib3B0aW9ucyIsImRvbWFpbiIsInVzZXJOYW1lIiwicGFzc3dvcmQiLCJ0b1VwcGVyQ2FzZSIsImlzVG9rZW5DcmVkZW50aWFsIiwiY3JlZGVudGlhbCIsImNsaWVudElkIiwidGVuYW50SWQiLCJ0b2tlbiIsImNsaWVudFNlY3JldCIsImFib3J0VHJhbnNhY3Rpb25PbkVycm9yIiwiYXBwTmFtZSIsImNhbWVsQ2FzZUNvbHVtbnMiLCJjYW5jZWxUaW1lb3V0IiwiY29sdW1uRW5jcnlwdGlvbktleUNhY2hlVFRMIiwiY29sdW1uRW5jcnlwdGlvblNldHRpbmciLCJjb2x1bW5OYW1lUmVwbGFjZXIiLCJjb25uZWN0aW9uUmV0cnlJbnRlcnZhbCIsImNvbm5lY3RUaW1lb3V0IiwiY29ubmVjdG9yIiwiY29ubmVjdGlvbklzb2xhdGlvbkxldmVsIiwiSVNPTEFUSU9OX0xFVkVMIiwiUkVBRF9DT01NSVRURUQiLCJjcnlwdG9DcmVkZW50aWFsc0RldGFpbHMiLCJkYXRhYmFzZSIsImRhdGVmaXJzdCIsImRhdGVGb3JtYXQiLCJkZWJ1ZyIsImRhdGEiLCJwYWNrZXQiLCJwYXlsb2FkIiwiZW5hYmxlQW5zaU51bGwiLCJlbmFibGVBbnNpTnVsbERlZmF1bHQiLCJlbmFibGVBbnNpUGFkZGluZyIsImVuYWJsZUFuc2lXYXJuaW5ncyIsImVuYWJsZUFyaXRoQWJvcnQiLCJlbmFibGVDb25jYXROdWxsWWllbGRzTnVsbCIsImVuYWJsZUN1cnNvckNsb3NlT25Db21taXQiLCJlbmFibGVJbXBsaWNpdFRyYW5zYWN0aW9ucyIsImVuYWJsZU51bWVyaWNSb3VuZGFib3J0IiwiZW5hYmxlUXVvdGVkSWRlbnRpZmllciIsImVuY3J5cHQiLCJmYWxsYmFja1RvRGVmYXVsdERiIiwiZW5jcnlwdGlvbktleVN0b3JlUHJvdmlkZXJzIiwiaW5zdGFuY2VOYW1lIiwiaXNvbGF0aW9uTGV2ZWwiLCJsYW5ndWFnZSIsImxvY2FsQWRkcmVzcyIsIm1heFJldHJpZXNPblRyYW5zaWVudEVycm9ycyIsIm11bHRpU3VibmV0RmFpbG92ZXIiLCJwYWNrZXRTaXplIiwicG9ydCIsInJlYWRPbmx5SW50ZW50IiwicmVxdWVzdFRpbWVvdXQiLCJyb3dDb2xsZWN0aW9uT25Eb25lIiwicm93Q29sbGVjdGlvbk9uUmVxdWVzdENvbXBsZXRpb24iLCJzZXJ2ZXJOYW1lIiwic2VydmVyU3VwcG9ydHNDb2x1bW5FbmNyeXB0aW9uIiwidGRzVmVyc2lvbiIsInRleHRzaXplIiwidHJ1c3RlZFNlcnZlck5hbWVBRSIsInRydXN0U2VydmVyQ2VydGlmaWNhdGUiLCJ1c2VDb2x1bW5OYW1lcyIsInVzZVVUQyIsIndvcmtzdGF0aW9uSWQiLCJsb3dlckNhc2VHdWlkcyIsIkVycm9yIiwiYXNzZXJ0VmFsaWRJc29sYXRpb25MZXZlbCIsIlJhbmdlRXJyb3IiLCJzZWN1cmVDb250ZXh0T3B0aW9ucyIsInNlY3VyZU9wdGlvbnMiLCJjcmVhdGUiLCJ2YWx1ZSIsImNvbnN0YW50cyIsIlNTTF9PUF9ET05UX0lOU0VSVF9FTVBUWV9GUkFHTUVOVFMiLCJjcmVhdGVEZWJ1ZyIsImluVHJhbnNhY3Rpb24iLCJ0cmFuc2FjdGlvbkRlc2NyaXB0b3JzIiwiQnVmZmVyIiwiZnJvbSIsInRyYW5zYWN0aW9uRGVwdGgiLCJpc1NxbEJhdGNoIiwiY2xvc2VkIiwibWVzc2FnZUJ1ZmZlciIsImFsbG9jIiwiY3VyVHJhbnNpZW50UmV0cnlDb3VudCIsInRyYW5zaWVudEVycm9yTG9va3VwIiwiVHJhbnNpZW50RXJyb3JMb29rdXAiLCJzdGF0ZSIsIlNUQVRFIiwiSU5JVElBTElaRUQiLCJhdHRlbnRpb25TZW50IiwiX2NhbmNlbEFmdGVyUmVxdWVzdFNlbnQiLCJtZXNzYWdlSW8iLCJzZW5kTWVzc2FnZSIsIlRZUEUiLCJBVFRFTlRJT04iLCJjcmVhdGVDYW5jZWxUaW1lciIsIl9vblNvY2tldENsb3NlIiwic29ja2V0Q2xvc2UiLCJfb25Tb2NrZXRFbmQiLCJzb2NrZXRFbmQiLCJfb25Tb2NrZXRFcnJvciIsImVycm9yIiwiZGlzcGF0Y2hFdmVudCIsInByb2Nlc3MiLCJuZXh0VGljayIsImVtaXQiLCJ3cmFwU29ja2V0RXJyb3IiLCJjb25uZWN0IiwiY29ubmVjdExpc3RlbmVyIiwiQ29ubmVjdGlvbkVycm9yIiwibmFtZSIsIm9uQ29ubmVjdCIsImVyciIsInJlbW92ZUxpc3RlbmVyIiwib25FcnJvciIsIm9uY2UiLCJ0cmFuc2l0aW9uVG8iLCJDT05ORUNUSU5HIiwiaW5pdGlhbGlzZUNvbm5lY3Rpb24iLCJ0aGVuIiwiRklOQUwiLCJvbiIsImV2ZW50IiwibGlzdGVuZXIiLCJhcmdzIiwiY2xvc2UiLCJjbGVhbnVwQ29ubmVjdGlvbiIsInRpbWVvdXRDb250cm9sbGVyIiwiQWJvcnRDb250cm9sbGVyIiwiY29ubmVjdFRpbWVyIiwic2V0VGltZW91dCIsImhvc3RQb3N0Zml4Iiwicm91dGluZ0RhdGEiLCJyb3V0aW5nTWVzc2FnZSIsIm1lc3NhZ2UiLCJsb2ciLCJhYm9ydCIsInNpZ25hbCIsImluc3RhbmNlTG9va3VwIiwidGltZW91dCIsInRocm93SWZBYm9ydGVkIiwiY2F1c2UiLCJzb2NrZXQiLCJjb25uZWN0T25Qb3J0IiwiY29udHJvbGxlciIsIm9uQ2xvc2UiLCJvbkVuZCIsImNvZGUiLCJBYm9ydFNpZ25hbCIsImFueSIsInNldEtlZXBBbGl2ZSIsIk1lc3NhZ2VJTyIsImNsZWFydGV4dCIsInNlbmRQcmVMb2dpbiIsIlNFTlRfUFJFTE9HSU4iLCJwcmVsb2dpblJlc3BvbnNlIiwicmVhZFByZWxvZ2luUmVzcG9uc2UiLCJwZXJmb3JtVGxzTmVnb3RpYXRpb24iLCJzZW5kTG9naW43UGFja2V0IiwiU0VOVF9MT0dJTjdfV0lUSF9GRURBVVRIIiwicGVyZm9ybVNlbnRMb2dpbjdXaXRoRmVkQXV0aCIsIlNFTlRfTE9HSU43X1dJVEhfTlRMTSIsInBlcmZvcm1TZW50TG9naW43V2l0aE5UTE1Mb2dpbiIsIlNFTlRfTE9HSU43X1dJVEhfU1RBTkRBUkRfTE9HSU4iLCJwZXJmb3JtU2VudExvZ2luN1dpdGhTdGFuZGFyZExvZ2luIiwiaXNUcmFuc2llbnRFcnJvciIsIlRSQU5TSUVOVF9GQUlMVVJFX1JFVFJZIiwicGVyZm9ybVRyYW5zaWVudEZhaWx1cmVSZXRyeSIsIlJFUk9VVElORyIsInBlcmZvcm1SZVJvdXRpbmciLCJMT0dHRURfSU5fU0VORElOR19JTklUSUFMX1NRTCIsInBlcmZvcm1Mb2dnZWRJblNlbmRpbmdJbml0aWFsU3FsIiwiZGVzdHJveSIsIkxPR0dFRF9JTiIsImNsZWFyVGltZW91dCIsImNsZWFyUmVxdWVzdFRpbWVyIiwiY2xlYXJDYW5jZWxUaW1lciIsImNsb3NlQ29ubmVjdGlvbiIsInJlcXVlc3QiLCJSZXF1ZXN0RXJyb3IiLCJjYWxsYmFjayIsIkRlYnVnIiwiY3JlYXRlVG9rZW5TdHJlYW1QYXJzZXIiLCJoYW5kbGVyIiwiVG9rZW5TdHJlYW1QYXJzZXIiLCJ3cmFwV2l0aFRscyIsInNlY3VyZUNvbnRleHQiLCJjcmVhdGVTZWN1cmVDb250ZXh0IiwiaXNJUCIsImVuY3J5cHRPcHRpb25zIiwiaG9zdCIsIkFMUE5Qcm90b2NvbHMiLCJzZXJ2ZXJuYW1lIiwiZW5jcnlwdHNvY2tldCIsIm9uQWJvcnQiLCJyZWFzb24iLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImN1c3RvbUNvbm5lY3RvciIsImNvbm5lY3RPcHRzIiwiY29ubmVjdEluUGFyYWxsZWwiLCJjb25uZWN0SW5TZXF1ZW5jZSIsImRucyIsImxvb2t1cCIsImVuZCIsImNhbmNlbFRpbWVyIiwiY3JlYXRlUmVxdWVzdFRpbWVyIiwicmVxdWVzdFRpbWVyIiwiY2FuY2VsIiwibmV3U3RhdGUiLCJleGl0IiwiZW50ZXIiLCJhcHBseSIsImdldEV2ZW50SGFuZGxlciIsImV2ZW50TmFtZSIsImV2ZW50cyIsIlNFTlRfVExTU1NMTkVHT1RJQVRJT04iLCJtYWpvciIsIm1pbm9yIiwiYnVpbGQiLCJleGVjIiwidmVyc2lvbiIsIlByZWxvZ2luUGF5bG9hZCIsIk51bWJlciIsInN1YmJ1aWxkIiwiUFJFTE9HSU4iLCJ0b1N0cmluZyIsIkxvZ2luN1BheWxvYWQiLCJ2ZXJzaW9ucyIsImNsaWVudFByb2dWZXIiLCJjbGllbnRQaWQiLCJwaWQiLCJjb25uZWN0aW9uSWQiLCJjbGllbnRUaW1lWm9uZSIsIkRhdGUiLCJnZXRUaW1lem9uZU9mZnNldCIsImNsaWVudExjaWQiLCJmZWRBdXRoIiwiZWNobyIsIndvcmtmbG93IiwiZmVkQXV0aFRva2VuIiwic3NwaSIsImNyZWF0ZU5UTE1SZXF1ZXN0IiwiaG9zdG5hbWUiLCJvcyIsImluc3RhbmNlIiwibGlicmFyeU5hbWUiLCJpbml0RGJGYXRhbCIsIkxPR0lONyIsInRvQnVmZmVyIiwic2VuZEZlZEF1dGhUb2tlbk1lc3NhZ2UiLCJhY2Nlc3NUb2tlbkxlbiIsImJ5dGVMZW5ndGgiLCJvZmZzZXQiLCJ3cml0ZVVJbnQzMkxFIiwid3JpdGUiLCJGRURBVVRIX1RPS0VOIiwic2VuZEluaXRpYWxTcWwiLCJTcWxCYXRjaFBheWxvYWQiLCJnZXRJbml0aWFsU3FsIiwiY3VycmVudFRyYW5zYWN0aW9uRGVzY3JpcHRvciIsIk1lc3NhZ2UiLCJTUUxfQkFUQ0giLCJvdXRnb2luZ01lc3NhZ2VTdHJlYW0iLCJSZWFkYWJsZSIsInBpcGUiLCJwdXNoIiwiZ2V0SXNvbGF0aW9uTGV2ZWxUZXh0Iiwiam9pbiIsImV4ZWNTcWxCYXRjaCIsIm1ha2VSZXF1ZXN0Iiwic3FsVGV4dE9yUHJvY2VkdXJlIiwiZXhlY1NxbCIsInZhbGlkYXRlUGFyYW1ldGVycyIsImRhdGFiYXNlQ29sbGF0aW9uIiwicGFyYW1ldGVycyIsIlRZUEVTIiwiTlZhckNoYXIiLCJvdXRwdXQiLCJsZW5ndGgiLCJwcmVjaXNpb24iLCJzY2FsZSIsIm1ha2VQYXJhbXNQYXJhbWV0ZXIiLCJSUENfUkVRVUVTVCIsIlJwY1JlcXVlc3RQYXlsb2FkIiwiUHJvY2VkdXJlcyIsIlNwX0V4ZWN1dGVTcWwiLCJuZXdCdWxrTG9hZCIsInRhYmxlIiwiY2FsbGJhY2tPck9wdGlvbnMiLCJCdWxrTG9hZCIsImV4ZWNCdWxrTG9hZCIsImJ1bGtMb2FkIiwicm93cyIsImV4ZWN1dGlvblN0YXJ0ZWQiLCJzdHJlYW1pbmdNb2RlIiwiZmlyc3RSb3dXcml0dGVuIiwicm93U3RyZWFtIiwicm93VG9QYWNrZXRUcmFuc2Zvcm0iLCJvbkNhbmNlbCIsIkJ1bGtMb2FkUGF5bG9hZCIsIlJlcXVlc3QiLCJnZXRCdWxrSW5zZXJ0U3FsIiwiQlVMS19MT0FEIiwicHJlcGFyZSIsIkludCIsInByZXBhcmluZyIsImhhbmRsZSIsIlNwX1ByZXBhcmUiLCJ1bnByZXBhcmUiLCJTcF9VbnByZXBhcmUiLCJleGVjdXRlIiwiZXhlY3V0ZVBhcmFtZXRlcnMiLCJsZW4iLCJwYXJhbWV0ZXIiLCJ2YWxpZGF0ZSIsIlNwX0V4ZWN1dGUiLCJjYWxsUHJvY2VkdXJlIiwiYmVnaW5UcmFuc2FjdGlvbiIsInRyYW5zYWN0aW9uIiwiVHJhbnNhY3Rpb24iLCJpc29sYXRpb25MZXZlbFRvVFNRTCIsIlRSQU5TQUNUSU9OX01BTkFHRVIiLCJiZWdpblBheWxvYWQiLCJjb21taXRUcmFuc2FjdGlvbiIsImNvbW1pdFBheWxvYWQiLCJyb2xsYmFja1RyYW5zYWN0aW9uIiwicm9sbGJhY2tQYXlsb2FkIiwic2F2ZVRyYW5zYWN0aW9uIiwic2F2ZVBheWxvYWQiLCJjYiIsInVzZVNhdmVwb2ludCIsImNyeXB0byIsInJhbmRvbUJ5dGVzIiwidHhEb25lIiwiZG9uZSIsInR4RXJyIiwicGFja2V0VHlwZSIsImNhbmNlbGVkIiwiY29ubmVjdGlvbiIsInJvd0NvdW50IiwicnN0IiwicGF5bG9hZFN0cmVhbSIsInVucGlwZSIsImlnbm9yZSIsInBhdXNlZCIsInJlc3VtZSIsInJlc2V0Q29ubmVjdGlvbiIsInJlc2V0Q29ubmVjdGlvbk9uTmV4dFJlcXVlc3QiLCJTRU5UX0NMSUVOVF9SRVFVRVNUIiwicHJlcGVuZE9uY2VMaXN0ZW5lciIsInJlc2V0IiwiUkVBRF9VTkNPTU1JVFRFRCIsIlJFUEVBVEFCTEVfUkVBRCIsIlNFUklBTElaQUJMRSIsIlNOQVBTSE9UIiwicHJlbG9naW5QYXlsb2FkIiwic2lnbmFsQWJvcnRlZCIsImVuY3J5cHRpb25TdHJpbmciLCJyYWNlIiwic3RhcnRUbHMiLCJjYXRjaCIsInJlYWRNZXNzYWdlIiwiaXRlcmF0b3IiLCJTeW1ib2wiLCJhc3luY0l0ZXJhdG9yIiwibmV4dCIsImNvbmNhdCIsInJldHVybiIsIkxvZ2luN1Rva2VuSGFuZGxlciIsInRva2VuU3RyZWFtUGFyc2VyIiwibG9naW5BY2tSZWNlaXZlZCIsImxvZ2luRXJyb3IiLCJudGxtcGFja2V0IiwiTlRMTVJlc3BvbnNlUGF5bG9hZCIsIk5UTE1BVVRIX1BLVCIsImZlZEF1dGhJbmZvVG9rZW4iLCJzdHN1cmwiLCJzcG4iLCJ0b2tlblNjb3BlIiwiVVJMIiwiY3JlZGVudGlhbHMiLCJVc2VybmFtZVBhc3N3b3JkQ3JlZGVudGlhbCIsIm1zaUFyZ3MiLCJNYW5hZ2VkSWRlbnRpdHlDcmVkZW50aWFsIiwibWFuYWdlZElkZW50aXR5Q2xpZW50SWQiLCJEZWZhdWx0QXp1cmVDcmVkZW50aWFsIiwiQ2xpZW50U2VjcmV0Q3JlZGVudGlhbCIsInRva2VuUmVzcG9uc2UiLCJnZXRUb2tlbiIsIkFnZ3JlZ2F0ZUVycm9yIiwiSW5pdGlhbFNxbFRva2VuSGFuZGxlciIsImVycm9ycyIsImlzVHJhbnNpZW50IiwiX2RlZmF1bHQiLCJleHBvcnRzIiwibW9kdWxlIiwicHJvdG90eXBlIiwic29ja2V0RXJyb3IiLCJSZXF1ZXN0VG9rZW5IYW5kbGVyIiwiU0VOVF9BVFRFTlRJT04iLCJvblJlc3VtZSIsIm9uUGF1c2UiLCJwYXVzZSIsIm9uRW5kT2ZNZXNzYWdlIiwic3FsUmVxdWVzdCIsIm5leHRTdGF0ZSIsIkF0dGVudGlvblRva2VuSGFuZGxlciIsImF0dGVudGlvblJlY2VpdmVkIl0sInNvdXJjZXMiOlsiLi4vc3JjL2Nvbm5lY3Rpb24udHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNyeXB0byBmcm9tICdjcnlwdG8nO1xuaW1wb3J0IG9zIGZyb20gJ29zJztcbmltcG9ydCAqIGFzIHRscyBmcm9tICd0bHMnO1xuaW1wb3J0ICogYXMgbmV0IGZyb20gJ25ldCc7XG5pbXBvcnQgZG5zIGZyb20gJ2Rucyc7XG5cbmltcG9ydCBjb25zdGFudHMgZnJvbSAnY29uc3RhbnRzJztcbmltcG9ydCB7IHR5cGUgU2VjdXJlQ29udGV4dE9wdGlvbnMgfSBmcm9tICd0bHMnO1xuXG5pbXBvcnQgeyBSZWFkYWJsZSB9IGZyb20gJ3N0cmVhbSc7XG5cbmltcG9ydCB7XG4gIENsaWVudFNlY3JldENyZWRlbnRpYWwsXG4gIERlZmF1bHRBenVyZUNyZWRlbnRpYWwsXG4gIE1hbmFnZWRJZGVudGl0eUNyZWRlbnRpYWwsXG4gIFVzZXJuYW1lUGFzc3dvcmRDcmVkZW50aWFsXG59IGZyb20gJ0BhenVyZS9pZGVudGl0eSc7XG5pbXBvcnQgeyB0eXBlIEFjY2Vzc1Rva2VuLCB0eXBlIFRva2VuQ3JlZGVudGlhbCwgaXNUb2tlbkNyZWRlbnRpYWwgfSBmcm9tICdAYXp1cmUvY29yZS1hdXRoJztcblxuaW1wb3J0IEJ1bGtMb2FkLCB7IHR5cGUgT3B0aW9ucyBhcyBCdWxrTG9hZE9wdGlvbnMsIHR5cGUgQ2FsbGJhY2sgYXMgQnVsa0xvYWRDYWxsYmFjayB9IGZyb20gJy4vYnVsay1sb2FkJztcbmltcG9ydCBEZWJ1ZyBmcm9tICcuL2RlYnVnJztcbmltcG9ydCB7IEV2ZW50RW1pdHRlciwgb25jZSB9IGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgeyBpbnN0YW5jZUxvb2t1cCB9IGZyb20gJy4vaW5zdGFuY2UtbG9va3VwJztcbmltcG9ydCB7IFRyYW5zaWVudEVycm9yTG9va3VwIH0gZnJvbSAnLi90cmFuc2llbnQtZXJyb3ItbG9va3VwJztcbmltcG9ydCB7IFRZUEUgfSBmcm9tICcuL3BhY2tldCc7XG5pbXBvcnQgUHJlbG9naW5QYXlsb2FkIGZyb20gJy4vcHJlbG9naW4tcGF5bG9hZCc7XG5pbXBvcnQgTG9naW43UGF5bG9hZCBmcm9tICcuL2xvZ2luNy1wYXlsb2FkJztcbmltcG9ydCBOVExNUmVzcG9uc2VQYXlsb2FkIGZyb20gJy4vbnRsbS1wYXlsb2FkJztcbmltcG9ydCBSZXF1ZXN0IGZyb20gJy4vcmVxdWVzdCc7XG5pbXBvcnQgUnBjUmVxdWVzdFBheWxvYWQgZnJvbSAnLi9ycGNyZXF1ZXN0LXBheWxvYWQnO1xuaW1wb3J0IFNxbEJhdGNoUGF5bG9hZCBmcm9tICcuL3NxbGJhdGNoLXBheWxvYWQnO1xuaW1wb3J0IE1lc3NhZ2VJTyBmcm9tICcuL21lc3NhZ2UtaW8nO1xuaW1wb3J0IHsgUGFyc2VyIGFzIFRva2VuU3RyZWFtUGFyc2VyIH0gZnJvbSAnLi90b2tlbi90b2tlbi1zdHJlYW0tcGFyc2VyJztcbmltcG9ydCB7IFRyYW5zYWN0aW9uLCBJU09MQVRJT05fTEVWRUwsIGFzc2VydFZhbGlkSXNvbGF0aW9uTGV2ZWwgfSBmcm9tICcuL3RyYW5zYWN0aW9uJztcbmltcG9ydCB7IENvbm5lY3Rpb25FcnJvciwgUmVxdWVzdEVycm9yIH0gZnJvbSAnLi9lcnJvcnMnO1xuaW1wb3J0IHsgY29ubmVjdEluUGFyYWxsZWwsIGNvbm5lY3RJblNlcXVlbmNlIH0gZnJvbSAnLi9jb25uZWN0b3InO1xuaW1wb3J0IHsgbmFtZSBhcyBsaWJyYXJ5TmFtZSB9IGZyb20gJy4vbGlicmFyeSc7XG5pbXBvcnQgeyB2ZXJzaW9ucyB9IGZyb20gJy4vdGRzLXZlcnNpb25zJztcbmltcG9ydCBNZXNzYWdlIGZyb20gJy4vbWVzc2FnZSc7XG5pbXBvcnQgeyB0eXBlIE1ldGFkYXRhIH0gZnJvbSAnLi9tZXRhZGF0YS1wYXJzZXInO1xuaW1wb3J0IHsgY3JlYXRlTlRMTVJlcXVlc3QgfSBmcm9tICcuL250bG0nO1xuaW1wb3J0IHsgQ29sdW1uRW5jcnlwdGlvbkF6dXJlS2V5VmF1bHRQcm92aWRlciB9IGZyb20gJy4vYWx3YXlzLWVuY3J5cHRlZC9rZXlzdG9yZS1wcm92aWRlci1henVyZS1rZXktdmF1bHQnO1xuXG5pbXBvcnQgeyB0eXBlIFBhcmFtZXRlciwgVFlQRVMgfSBmcm9tICcuL2RhdGEtdHlwZSc7XG5pbXBvcnQgeyBCdWxrTG9hZFBheWxvYWQgfSBmcm9tICcuL2J1bGstbG9hZC1wYXlsb2FkJztcbmltcG9ydCB7IENvbGxhdGlvbiB9IGZyb20gJy4vY29sbGF0aW9uJztcbmltcG9ydCBQcm9jZWR1cmVzIGZyb20gJy4vc3BlY2lhbC1zdG9yZWQtcHJvY2VkdXJlJztcblxuaW1wb3J0IHsgdmVyc2lvbiB9IGZyb20gJy4uL3BhY2thZ2UuanNvbic7XG5pbXBvcnQgeyBVUkwgfSBmcm9tICd1cmwnO1xuaW1wb3J0IHsgQXR0ZW50aW9uVG9rZW5IYW5kbGVyLCBJbml0aWFsU3FsVG9rZW5IYW5kbGVyLCBMb2dpbjdUb2tlbkhhbmRsZXIsIFJlcXVlc3RUb2tlbkhhbmRsZXIsIFRva2VuSGFuZGxlciB9IGZyb20gJy4vdG9rZW4vaGFuZGxlcic7XG5cbnR5cGUgQmVnaW5UcmFuc2FjdGlvbkNhbGxiYWNrID1cbiAgLyoqXG4gICAqIFRoZSBjYWxsYmFjayBpcyBjYWxsZWQgd2hlbiB0aGUgcmVxdWVzdCB0byBzdGFydCB0aGUgdHJhbnNhY3Rpb24gaGFzIGNvbXBsZXRlZCxcbiAgICogZWl0aGVyIHN1Y2Nlc3NmdWxseSBvciB3aXRoIGFuIGVycm9yLlxuICAgKiBJZiBhbiBlcnJvciBvY2N1cnJlZCB0aGVuIGBlcnJgIHdpbGwgZGVzY3JpYmUgdGhlIGVycm9yLlxuICAgKlxuICAgKiBBcyBvbmx5IG9uZSByZXF1ZXN0IGF0IGEgdGltZSBtYXkgYmUgZXhlY3V0ZWQgb24gYSBjb25uZWN0aW9uLCBhbm90aGVyIHJlcXVlc3Qgc2hvdWxkIG5vdFxuICAgKiBiZSBpbml0aWF0ZWQgdW50aWwgdGhpcyBjYWxsYmFjayBpcyBjYWxsZWQuXG4gICAqXG4gICAqIEBwYXJhbSBlcnIgSWYgYW4gZXJyb3Igb2NjdXJyZWQsIGFuIFtbRXJyb3JdXSBvYmplY3Qgd2l0aCBkZXRhaWxzIG9mIHRoZSBlcnJvci5cbiAgICogQHBhcmFtIHRyYW5zYWN0aW9uRGVzY3JpcHRvciBBIEJ1ZmZlciB0aGF0IGRlc2NyaWJlIHRoZSB0cmFuc2FjdGlvblxuICAgKi9cbiAgKGVycjogRXJyb3IgfCBudWxsIHwgdW5kZWZpbmVkLCB0cmFuc2FjdGlvbkRlc2NyaXB0b3I/OiBCdWZmZXIpID0+IHZvaWRcblxudHlwZSBTYXZlVHJhbnNhY3Rpb25DYWxsYmFjayA9XG4gIC8qKlxuICAgKiBUaGUgY2FsbGJhY2sgaXMgY2FsbGVkIHdoZW4gdGhlIHJlcXVlc3QgdG8gc2V0IGEgc2F2ZXBvaW50IHdpdGhpbiB0aGVcbiAgICogdHJhbnNhY3Rpb24gaGFzIGNvbXBsZXRlZCwgZWl0aGVyIHN1Y2Nlc3NmdWxseSBvciB3aXRoIGFuIGVycm9yLlxuICAgKiBJZiBhbiBlcnJvciBvY2N1cnJlZCB0aGVuIGBlcnJgIHdpbGwgZGVzY3JpYmUgdGhlIGVycm9yLlxuICAgKlxuICAgKiBBcyBvbmx5IG9uZSByZXF1ZXN0IGF0IGEgdGltZSBtYXkgYmUgZXhlY3V0ZWQgb24gYSBjb25uZWN0aW9uLCBhbm90aGVyIHJlcXVlc3Qgc2hvdWxkIG5vdFxuICAgKiBiZSBpbml0aWF0ZWQgdW50aWwgdGhpcyBjYWxsYmFjayBpcyBjYWxsZWQuXG4gICAqXG4gICAqIEBwYXJhbSBlcnIgSWYgYW4gZXJyb3Igb2NjdXJyZWQsIGFuIFtbRXJyb3JdXSBvYmplY3Qgd2l0aCBkZXRhaWxzIG9mIHRoZSBlcnJvci5cbiAgICovXG4gIChlcnI6IEVycm9yIHwgbnVsbCB8IHVuZGVmaW5lZCkgPT4gdm9pZDtcblxudHlwZSBDb21taXRUcmFuc2FjdGlvbkNhbGxiYWNrID1cbiAgLyoqXG4gICAqIFRoZSBjYWxsYmFjayBpcyBjYWxsZWQgd2hlbiB0aGUgcmVxdWVzdCB0byBjb21taXQgdGhlIHRyYW5zYWN0aW9uIGhhcyBjb21wbGV0ZWQsXG4gICAqIGVpdGhlciBzdWNjZXNzZnVsbHkgb3Igd2l0aCBhbiBlcnJvci5cbiAgICogSWYgYW4gZXJyb3Igb2NjdXJyZWQgdGhlbiBgZXJyYCB3aWxsIGRlc2NyaWJlIHRoZSBlcnJvci5cbiAgICpcbiAgICogQXMgb25seSBvbmUgcmVxdWVzdCBhdCBhIHRpbWUgbWF5IGJlIGV4ZWN1dGVkIG9uIGEgY29ubmVjdGlvbiwgYW5vdGhlciByZXF1ZXN0IHNob3VsZCBub3RcbiAgICogYmUgaW5pdGlhdGVkIHVudGlsIHRoaXMgY2FsbGJhY2sgaXMgY2FsbGVkLlxuICAgKlxuICAgKiBAcGFyYW0gZXJyIElmIGFuIGVycm9yIG9jY3VycmVkLCBhbiBbW0Vycm9yXV0gb2JqZWN0IHdpdGggZGV0YWlscyBvZiB0aGUgZXJyb3IuXG4gICAqL1xuICAoZXJyOiBFcnJvciB8IG51bGwgfCB1bmRlZmluZWQpID0+IHZvaWQ7XG5cbnR5cGUgUm9sbGJhY2tUcmFuc2FjdGlvbkNhbGxiYWNrID1cbiAgLyoqXG4gICAqIFRoZSBjYWxsYmFjayBpcyBjYWxsZWQgd2hlbiB0aGUgcmVxdWVzdCB0byByb2xsYmFjayB0aGUgdHJhbnNhY3Rpb24gaGFzXG4gICAqIGNvbXBsZXRlZCwgZWl0aGVyIHN1Y2Nlc3NmdWxseSBvciB3aXRoIGFuIGVycm9yLlxuICAgKiBJZiBhbiBlcnJvciBvY2N1cnJlZCB0aGVuIGVyciB3aWxsIGRlc2NyaWJlIHRoZSBlcnJvci5cbiAgICpcbiAgICogQXMgb25seSBvbmUgcmVxdWVzdCBhdCBhIHRpbWUgbWF5IGJlIGV4ZWN1dGVkIG9uIGEgY29ubmVjdGlvbiwgYW5vdGhlciByZXF1ZXN0IHNob3VsZCBub3RcbiAgICogYmUgaW5pdGlhdGVkIHVudGlsIHRoaXMgY2FsbGJhY2sgaXMgY2FsbGVkLlxuICAgKlxuICAgKiBAcGFyYW0gZXJyIElmIGFuIGVycm9yIG9jY3VycmVkLCBhbiBbW0Vycm9yXV0gb2JqZWN0IHdpdGggZGV0YWlscyBvZiB0aGUgZXJyb3IuXG4gICAqL1xuICAoZXJyOiBFcnJvciB8IG51bGwgfCB1bmRlZmluZWQpID0+IHZvaWQ7XG5cbnR5cGUgUmVzZXRDYWxsYmFjayA9XG4gIC8qKlxuICAgKiBUaGUgY2FsbGJhY2sgaXMgY2FsbGVkIHdoZW4gdGhlIGNvbm5lY3Rpb24gcmVzZXQgaGFzIGNvbXBsZXRlZCxcbiAgICogZWl0aGVyIHN1Y2Nlc3NmdWxseSBvciB3aXRoIGFuIGVycm9yLlxuICAgKlxuICAgKiBJZiBhbiBlcnJvciBvY2N1cnJlZCB0aGVuIGBlcnJgIHdpbGwgZGVzY3JpYmUgdGhlIGVycm9yLlxuICAgKlxuICAgKiBBcyBvbmx5IG9uZSByZXF1ZXN0IGF0IGEgdGltZSBtYXkgYmUgZXhlY3V0ZWQgb24gYSBjb25uZWN0aW9uLCBhbm90aGVyXG4gICAqIHJlcXVlc3Qgc2hvdWxkIG5vdCBiZSBpbml0aWF0ZWQgdW50aWwgdGhpcyBjYWxsYmFjayBpcyBjYWxsZWRcbiAgICpcbiAgICogQHBhcmFtIGVyciBJZiBhbiBlcnJvciBvY2N1cnJlZCwgYW4gW1tFcnJvcl1dIG9iamVjdCB3aXRoIGRldGFpbHMgb2YgdGhlIGVycm9yLlxuICAgKi9cbiAgKGVycjogRXJyb3IgfCBudWxsIHwgdW5kZWZpbmVkKSA9PiB2b2lkO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzXG50eXBlIFRyYW5zYWN0aW9uQ2FsbGJhY2s8VCBleHRlbmRzIChlcnI6IEVycm9yIHwgbnVsbCB8IHVuZGVmaW5lZCwgLi4uYXJnczogYW55W10pID0+IHZvaWQ+ID1cbiAgLyoqXG4gICAqIFRoZSBjYWxsYmFjayBpcyBjYWxsZWQgd2hlbiB0aGUgcmVxdWVzdCB0byBzdGFydCBhIHRyYW5zYWN0aW9uIChvciBjcmVhdGUgYSBzYXZlcG9pbnQsIGluXG4gICAqIHRoZSBjYXNlIG9mIGEgbmVzdGVkIHRyYW5zYWN0aW9uKSBoYXMgY29tcGxldGVkLCBlaXRoZXIgc3VjY2Vzc2Z1bGx5IG9yIHdpdGggYW4gZXJyb3IuXG4gICAqIElmIGFuIGVycm9yIG9jY3VycmVkLCB0aGVuIGBlcnJgIHdpbGwgZGVzY3JpYmUgdGhlIGVycm9yLlxuICAgKiBJZiBubyBlcnJvciBvY2N1cnJlZCwgdGhlIGNhbGxiYWNrIHNob3VsZCBwZXJmb3JtIGl0cyB3b3JrIGFuZCBldmVudHVhbGx5IGNhbGxcbiAgICogYGRvbmVgIHdpdGggYW4gZXJyb3Igb3IgbnVsbCAodG8gdHJpZ2dlciBhIHRyYW5zYWN0aW9uIHJvbGxiYWNrIG9yIGFcbiAgICogdHJhbnNhY3Rpb24gY29tbWl0KSBhbmQgYW4gYWRkaXRpb25hbCBjb21wbGV0aW9uIGNhbGxiYWNrIHRoYXQgd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgcmVxdWVzdFxuICAgKiB0byByb2xsYmFjayBvciBjb21taXQgdGhlIGN1cnJlbnQgdHJhbnNhY3Rpb24gaGFzIGNvbXBsZXRlZCwgZWl0aGVyIHN1Y2Nlc3NmdWxseSBvciB3aXRoIGFuIGVycm9yLlxuICAgKiBBZGRpdGlvbmFsIGFyZ3VtZW50cyBnaXZlbiB0byBgZG9uZWAgd2lsbCBiZSBwYXNzZWQgdGhyb3VnaCB0byB0aGlzIGNhbGxiYWNrLlxuICAgKlxuICAgKiBBcyBvbmx5IG9uZSByZXF1ZXN0IGF0IGEgdGltZSBtYXkgYmUgZXhlY3V0ZWQgb24gYSBjb25uZWN0aW9uLCBhbm90aGVyIHJlcXVlc3Qgc2hvdWxkIG5vdFxuICAgKiBiZSBpbml0aWF0ZWQgdW50aWwgdGhlIGNvbXBsZXRpb24gY2FsbGJhY2sgaXMgY2FsbGVkLlxuICAgKlxuICAgKiBAcGFyYW0gZXJyIElmIGFuIGVycm9yIG9jY3VycmVkLCBhbiBbW0Vycm9yXV0gb2JqZWN0IHdpdGggZGV0YWlscyBvZiB0aGUgZXJyb3IuXG4gICAqIEBwYXJhbSB0eERvbmUgSWYgbm8gZXJyb3Igb2NjdXJyZWQsIGEgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIHRvIGNvbW1pdCBvciByb2xsYmFjayB0aGUgdHJhbnNhY3Rpb24uXG4gICAqL1xuICAoZXJyOiBFcnJvciB8IG51bGwgfCB1bmRlZmluZWQsIHR4RG9uZT86IFRyYW5zYWN0aW9uRG9uZTxUPikgPT4gdm9pZDtcblxudHlwZSBUcmFuc2FjdGlvbkRvbmVDYWxsYmFjayA9IChlcnI6IEVycm9yIHwgbnVsbCB8IHVuZGVmaW5lZCwgLi4uYXJnczogYW55W10pID0+IHZvaWQ7XG50eXBlIENhbGxiYWNrUGFyYW1ldGVyczxUIGV4dGVuZHMgKGVycjogRXJyb3IgfCBudWxsIHwgdW5kZWZpbmVkLCAuLi5hcmdzOiBhbnlbXSkgPT4gYW55PiA9IFQgZXh0ZW5kcyAoZXJyOiBFcnJvciB8IG51bGwgfCB1bmRlZmluZWQsIC4uLmFyZ3M6IGluZmVyIFApID0+IGFueSA/IFAgOiBuZXZlcjtcblxudHlwZSBUcmFuc2FjdGlvbkRvbmU8VCBleHRlbmRzIChlcnI6IEVycm9yIHwgbnVsbCB8IHVuZGVmaW5lZCwgLi4uYXJnczogYW55W10pID0+IHZvaWQ+ID1cbiAgLyoqXG4gICAqIElmIG5vIGVycm9yIG9jY3VycmVkLCBhIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB0byBjb21taXQgb3Igcm9sbGJhY2sgdGhlIHRyYW5zYWN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gZXJyIElmIGFuIGVyciBvY2N1cnJlZCwgYSBzdHJpbmcgd2l0aCBkZXRhaWxzIG9mIHRoZSBlcnJvci5cbiAgICovXG4gIChlcnI6IEVycm9yIHwgbnVsbCB8IHVuZGVmaW5lZCwgZG9uZTogVCwgLi4uYXJnczogQ2FsbGJhY2tQYXJhbWV0ZXJzPFQ+KSA9PiB2b2lkO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmNvbnN0IEtFRVBfQUxJVkVfSU5JVElBTF9ERUxBWSA9IDMwICogMTAwMDtcbi8qKlxuICogQHByaXZhdGVcbiAqL1xuY29uc3QgREVGQVVMVF9DT05ORUNUX1RJTUVPVVQgPSAxNSAqIDEwMDA7XG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmNvbnN0IERFRkFVTFRfQ0xJRU5UX1JFUVVFU1RfVElNRU9VVCA9IDE1ICogMTAwMDtcbi8qKlxuICogQHByaXZhdGVcbiAqL1xuY29uc3QgREVGQVVMVF9DQU5DRUxfVElNRU9VVCA9IDUgKiAxMDAwO1xuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jb25zdCBERUZBVUxUX0NPTk5FQ1RfUkVUUllfSU5URVJWQUwgPSA1MDA7XG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmNvbnN0IERFRkFVTFRfUEFDS0VUX1NJWkUgPSA0ICogMTAyNDtcbi8qKlxuICogQHByaXZhdGVcbiAqL1xuY29uc3QgREVGQVVMVF9URVhUU0laRSA9IDIxNDc0ODM2NDc7XG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmNvbnN0IERFRkFVTFRfREFURUZJUlNUID0gNztcbi8qKlxuICogQHByaXZhdGVcbiAqL1xuY29uc3QgREVGQVVMVF9QT1JUID0gMTQzMztcbi8qKlxuICogQHByaXZhdGVcbiAqL1xuY29uc3QgREVGQVVMVF9URFNfVkVSU0lPTiA9ICc3XzQnO1xuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jb25zdCBERUZBVUxUX0xBTkdVQUdFID0gJ3VzX2VuZ2xpc2gnO1xuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jb25zdCBERUZBVUxUX0RBVEVGT1JNQVQgPSAnbWR5JztcblxuaW50ZXJmYWNlIEF6dXJlQWN0aXZlRGlyZWN0b3J5TXNpQXBwU2VydmljZUF1dGhlbnRpY2F0aW9uIHtcbiAgdHlwZTogJ2F6dXJlLWFjdGl2ZS1kaXJlY3RvcnktbXNpLWFwcC1zZXJ2aWNlJztcbiAgb3B0aW9uczoge1xuICAgIC8qKlxuICAgICAqIElmIHlvdSB1c2VyIHdhbnQgdG8gY29ubmVjdCB0byBhbiBBenVyZSBhcHAgc2VydmljZSB1c2luZyBhIHNwZWNpZmljIGNsaWVudCBhY2NvdW50XG4gICAgICogdGhleSBuZWVkIHRvIHByb3ZpZGUgYGNsaWVudElkYCBhc3NvY2lhdGUgdG8gdGhlaXIgY3JlYXRlZCBpZGVudGl0eS5cbiAgICAgKlxuICAgICAqIFRoaXMgaXMgb3B0aW9uYWwgZm9yIHJldHJpZXZlIHRva2VuIGZyb20gYXp1cmUgd2ViIGFwcCBzZXJ2aWNlXG4gICAgICovXG4gICAgY2xpZW50SWQ/OiBzdHJpbmc7XG4gIH07XG59XG5cbmludGVyZmFjZSBBenVyZUFjdGl2ZURpcmVjdG9yeU1zaVZtQXV0aGVudGljYXRpb24ge1xuICB0eXBlOiAnYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1tc2ktdm0nO1xuICBvcHRpb25zOiB7XG4gICAgLyoqXG4gICAgICogSWYgeW91IHdhbnQgdG8gY29ubmVjdCB1c2luZyBhIHNwZWNpZmljIGNsaWVudCBhY2NvdW50XG4gICAgICogdGhleSBuZWVkIHRvIHByb3ZpZGUgYGNsaWVudElkYCBhc3NvY2lhdGVkIHRvIHRoZWlyIGNyZWF0ZWQgaWRlbnRpdHkuXG4gICAgICpcbiAgICAgKiBUaGlzIGlzIG9wdGlvbmFsIGZvciByZXRyaWV2ZSBhIHRva2VuXG4gICAgICovXG4gICAgY2xpZW50SWQ/OiBzdHJpbmc7XG4gIH07XG59XG5cbmludGVyZmFjZSBBenVyZUFjdGl2ZURpcmVjdG9yeURlZmF1bHRBdXRoZW50aWNhdGlvbiB7XG4gIHR5cGU6ICdhenVyZS1hY3RpdmUtZGlyZWN0b3J5LWRlZmF1bHQnO1xuICBvcHRpb25zOiB7XG4gICAgLyoqXG4gICAgICogSWYgeW91IHdhbnQgdG8gY29ubmVjdCB1c2luZyBhIHNwZWNpZmljIGNsaWVudCBhY2NvdW50XG4gICAgICogdGhleSBuZWVkIHRvIHByb3ZpZGUgYGNsaWVudElkYCBhc3NvY2lhdGVkIHRvIHRoZWlyIGNyZWF0ZWQgaWRlbnRpdHkuXG4gICAgICpcbiAgICAgKiBUaGlzIGlzIG9wdGlvbmFsIGZvciByZXRyaWV2aW5nIGEgdG9rZW5cbiAgICAgKi9cbiAgICBjbGllbnRJZD86IHN0cmluZztcbiAgfTtcbn1cblxuXG5pbnRlcmZhY2UgQXp1cmVBY3RpdmVEaXJlY3RvcnlBY2Nlc3NUb2tlbkF1dGhlbnRpY2F0aW9uIHtcbiAgdHlwZTogJ2F6dXJlLWFjdGl2ZS1kaXJlY3RvcnktYWNjZXNzLXRva2VuJztcbiAgb3B0aW9uczoge1xuICAgIC8qKlxuICAgICAqIEEgdXNlciBuZWVkIHRvIHByb3ZpZGUgYHRva2VuYCB3aGljaCB0aGV5IHJldHJpZXZlZCBlbHNlIHdoZXJlXG4gICAgICogdG8gZm9ybWluZyB0aGUgY29ubmVjdGlvbi5cbiAgICAgKi9cbiAgICB0b2tlbjogc3RyaW5nO1xuICB9O1xufVxuXG5pbnRlcmZhY2UgQXp1cmVBY3RpdmVEaXJlY3RvcnlQYXNzd29yZEF1dGhlbnRpY2F0aW9uIHtcbiAgdHlwZTogJ2F6dXJlLWFjdGl2ZS1kaXJlY3RvcnktcGFzc3dvcmQnO1xuICBvcHRpb25zOiB7XG4gICAgLyoqXG4gICAgICogQSB1c2VyIG5lZWQgdG8gcHJvdmlkZSBgdXNlck5hbWVgIGFzc29jaWF0ZSB0byB0aGVpciBhY2NvdW50LlxuICAgICAqL1xuICAgIHVzZXJOYW1lOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBBIHVzZXIgbmVlZCB0byBwcm92aWRlIGBwYXNzd29yZGAgYXNzb2NpYXRlIHRvIHRoZWlyIGFjY291bnQuXG4gICAgICovXG4gICAgcGFzc3dvcmQ6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIEEgY2xpZW50IGlkIHRvIHVzZS5cbiAgICAgKi9cbiAgICBjbGllbnRJZDogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogT3B0aW9uYWwgcGFyYW1ldGVyIGZvciBzcGVjaWZpYyBBenVyZSB0ZW5hbnQgSURcbiAgICAgKi9cbiAgICB0ZW5hbnRJZDogc3RyaW5nO1xuICB9O1xufVxuXG5pbnRlcmZhY2UgQXp1cmVBY3RpdmVEaXJlY3RvcnlTZXJ2aWNlUHJpbmNpcGFsU2VjcmV0IHtcbiAgdHlwZTogJ2F6dXJlLWFjdGl2ZS1kaXJlY3Rvcnktc2VydmljZS1wcmluY2lwYWwtc2VjcmV0JztcbiAgb3B0aW9uczoge1xuICAgIC8qKlxuICAgICAqIEFwcGxpY2F0aW9uIChgY2xpZW50YCkgSUQgZnJvbSB5b3VyIHJlZ2lzdGVyZWQgQXp1cmUgYXBwbGljYXRpb25cbiAgICAgKi9cbiAgICBjbGllbnRJZDogc3RyaW5nO1xuICAgIC8qKlxuICAgICAqIFRoZSBjcmVhdGVkIGBjbGllbnQgc2VjcmV0YCBmb3IgdGhpcyByZWdpc3RlcmVkIEF6dXJlIGFwcGxpY2F0aW9uXG4gICAgICovXG4gICAgY2xpZW50U2VjcmV0OiBzdHJpbmc7XG4gICAgLyoqXG4gICAgICogRGlyZWN0b3J5IChgdGVuYW50YCkgSUQgZnJvbSB5b3VyIHJlZ2lzdGVyZWQgQXp1cmUgYXBwbGljYXRpb25cbiAgICAgKi9cbiAgICB0ZW5hbnRJZDogc3RyaW5nO1xuICB9O1xufVxuXG4vKiogU3RydWN0dXJlIHRoYXQgZGVmaW5lcyB0aGUgb3B0aW9ucyB0aGF0IGFyZSBuZWNlc3NhcnkgdG8gYXV0aGVudGljYXRlIHRoZSBUZWRpb3VzLkpTIGluc3RhbmNlIHdpdGggYW4gYEBhenVyZS9pZGVudGl0eWAgdG9rZW4gY3JlZGVudGlhbC4gKi9cbmludGVyZmFjZSBUb2tlbkNyZWRlbnRpYWxBdXRoZW50aWNhdGlvbiB7XG4gIC8qKiBVbmlxdWUgZGVzaWduYXRvciBmb3IgdGhlIHR5cGUgb2YgYXV0aGVudGljYXRpb24gdG8gYmUgdXNlZC4gKi9cbiAgdHlwZTogJ3Rva2VuLWNyZWRlbnRpYWwnO1xuICAvKiogU2V0IG9mIGNvbmZpZ3VyYXRpb25zIHRoYXQgYXJlIHJlcXVpcmVkIG9yIGFsbG93ZWQgd2l0aCB0aGlzIGF1dGhlbnRpY2F0aW9uIHR5cGUuICovXG4gIG9wdGlvbnM6IHtcbiAgICAvKiogQ3JlZGVudGlhbCBvYmplY3QgdXNlZCB0byBhdXRoZW50aWNhdGUgdG8gdGhlIHJlc291cmNlLiAqL1xuICAgIGNyZWRlbnRpYWw6IFRva2VuQ3JlZGVudGlhbDtcbiAgfTtcbn1cblxuaW50ZXJmYWNlIE50bG1BdXRoZW50aWNhdGlvbiB7XG4gIHR5cGU6ICdudGxtJztcbiAgb3B0aW9uczoge1xuICAgIC8qKlxuICAgICAqIFVzZXIgbmFtZSBmcm9tIHlvdXIgd2luZG93cyBhY2NvdW50LlxuICAgICAqL1xuICAgIHVzZXJOYW1lOiBzdHJpbmc7XG4gICAgLyoqXG4gICAgICogUGFzc3dvcmQgZnJvbSB5b3VyIHdpbmRvd3MgYWNjb3VudC5cbiAgICAgKi9cbiAgICBwYXNzd29yZDogc3RyaW5nO1xuICAgIC8qKlxuICAgICAqIE9uY2UgeW91IHNldCBkb21haW4gZm9yIG50bG0gYXV0aGVudGljYXRpb24gdHlwZSwgZHJpdmVyIHdpbGwgY29ubmVjdCB0byBTUUwgU2VydmVyIHVzaW5nIGRvbWFpbiBsb2dpbi5cbiAgICAgKlxuICAgICAqIFRoaXMgaXMgbmVjZXNzYXJ5IGZvciBmb3JtaW5nIGEgY29ubmVjdGlvbiB1c2luZyBudGxtIHR5cGVcbiAgICAgKi9cbiAgICBkb21haW46IHN0cmluZztcbiAgfTtcbn1cblxuaW50ZXJmYWNlIERlZmF1bHRBdXRoZW50aWNhdGlvbiB7XG4gIHR5cGU6ICdkZWZhdWx0JztcbiAgb3B0aW9uczoge1xuICAgIC8qKlxuICAgICAqIFVzZXIgbmFtZSB0byB1c2UgZm9yIHNxbCBzZXJ2ZXIgbG9naW4uXG4gICAgICovXG4gICAgdXNlck5hbWU/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogUGFzc3dvcmQgdG8gdXNlIGZvciBzcWwgc2VydmVyIGxvZ2luLlxuICAgICAqL1xuICAgIHBhc3N3b3JkPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICB9O1xufVxuXG5pbnRlcmZhY2UgRXJyb3JXaXRoQ29kZSBleHRlbmRzIEVycm9yIHtcbiAgY29kZT86IHN0cmluZztcbn1cblxuZXhwb3J0IHR5cGUgQ29ubmVjdGlvbkF1dGhlbnRpY2F0aW9uID0gRGVmYXVsdEF1dGhlbnRpY2F0aW9uIHwgTnRsbUF1dGhlbnRpY2F0aW9uIHwgVG9rZW5DcmVkZW50aWFsQXV0aGVudGljYXRpb24gfCBBenVyZUFjdGl2ZURpcmVjdG9yeVBhc3N3b3JkQXV0aGVudGljYXRpb24gfCBBenVyZUFjdGl2ZURpcmVjdG9yeU1zaUFwcFNlcnZpY2VBdXRoZW50aWNhdGlvbiB8IEF6dXJlQWN0aXZlRGlyZWN0b3J5TXNpVm1BdXRoZW50aWNhdGlvbiB8IEF6dXJlQWN0aXZlRGlyZWN0b3J5QWNjZXNzVG9rZW5BdXRoZW50aWNhdGlvbiB8IEF6dXJlQWN0aXZlRGlyZWN0b3J5U2VydmljZVByaW5jaXBhbFNlY3JldCB8IEF6dXJlQWN0aXZlRGlyZWN0b3J5RGVmYXVsdEF1dGhlbnRpY2F0aW9uO1xuXG5pbnRlcmZhY2UgSW50ZXJuYWxDb25uZWN0aW9uQ29uZmlnIHtcbiAgc2VydmVyOiBzdHJpbmc7XG4gIGF1dGhlbnRpY2F0aW9uOiBDb25uZWN0aW9uQXV0aGVudGljYXRpb247XG4gIG9wdGlvbnM6IEludGVybmFsQ29ubmVjdGlvbk9wdGlvbnM7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSW50ZXJuYWxDb25uZWN0aW9uT3B0aW9ucyB7XG4gIGFib3J0VHJhbnNhY3Rpb25PbkVycm9yOiBib29sZWFuO1xuICBhcHBOYW1lOiB1bmRlZmluZWQgfCBzdHJpbmc7XG4gIGNhbWVsQ2FzZUNvbHVtbnM6IGJvb2xlYW47XG4gIGNhbmNlbFRpbWVvdXQ6IG51bWJlcjtcbiAgY29sdW1uRW5jcnlwdGlvbktleUNhY2hlVFRMOiBudW1iZXI7XG4gIGNvbHVtbkVuY3J5cHRpb25TZXR0aW5nOiBib29sZWFuO1xuICBjb2x1bW5OYW1lUmVwbGFjZXI6IHVuZGVmaW5lZCB8ICgoY29sTmFtZTogc3RyaW5nLCBpbmRleDogbnVtYmVyLCBtZXRhZGF0YTogTWV0YWRhdGEpID0+IHN0cmluZyk7XG4gIGNvbm5lY3Rpb25SZXRyeUludGVydmFsOiBudW1iZXI7XG4gIGNvbm5lY3RvcjogdW5kZWZpbmVkIHwgKCgpID0+IFByb21pc2U8bmV0LlNvY2tldD4pO1xuICBjb25uZWN0VGltZW91dDogbnVtYmVyO1xuICBjb25uZWN0aW9uSXNvbGF0aW9uTGV2ZWw6IHR5cGVvZiBJU09MQVRJT05fTEVWRUxba2V5b2YgdHlwZW9mIElTT0xBVElPTl9MRVZFTF07XG4gIGNyeXB0b0NyZWRlbnRpYWxzRGV0YWlsczogU2VjdXJlQ29udGV4dE9wdGlvbnM7XG4gIGRhdGFiYXNlOiB1bmRlZmluZWQgfCBzdHJpbmc7XG4gIGRhdGVmaXJzdDogbnVtYmVyO1xuICBkYXRlRm9ybWF0OiBzdHJpbmc7XG4gIGRlYnVnOiB7XG4gICAgZGF0YTogYm9vbGVhbjtcbiAgICBwYWNrZXQ6IGJvb2xlYW47XG4gICAgcGF5bG9hZDogYm9vbGVhbjtcbiAgICB0b2tlbjogYm9vbGVhbjtcbiAgfTtcbiAgZW5hYmxlQW5zaU51bGw6IG51bGwgfCBib29sZWFuO1xuICBlbmFibGVBbnNpTnVsbERlZmF1bHQ6IG51bGwgfCBib29sZWFuO1xuICBlbmFibGVBbnNpUGFkZGluZzogbnVsbCB8IGJvb2xlYW47XG4gIGVuYWJsZUFuc2lXYXJuaW5nczogbnVsbCB8IGJvb2xlYW47XG4gIGVuYWJsZUFyaXRoQWJvcnQ6IG51bGwgfCBib29sZWFuO1xuICBlbmFibGVDb25jYXROdWxsWWllbGRzTnVsbDogbnVsbCB8IGJvb2xlYW47XG4gIGVuYWJsZUN1cnNvckNsb3NlT25Db21taXQ6IG51bGwgfCBib29sZWFuO1xuICBlbmFibGVJbXBsaWNpdFRyYW5zYWN0aW9uczogbnVsbCB8IGJvb2xlYW47XG4gIGVuYWJsZU51bWVyaWNSb3VuZGFib3J0OiBudWxsIHwgYm9vbGVhbjtcbiAgZW5hYmxlUXVvdGVkSWRlbnRpZmllcjogbnVsbCB8IGJvb2xlYW47XG4gIGVuY3J5cHQ6IHN0cmluZyB8IGJvb2xlYW47XG4gIGVuY3J5cHRpb25LZXlTdG9yZVByb3ZpZGVyczogS2V5U3RvcmVQcm92aWRlck1hcCB8IHVuZGVmaW5lZDtcbiAgZmFsbGJhY2tUb0RlZmF1bHREYjogYm9vbGVhbjtcbiAgaW5zdGFuY2VOYW1lOiB1bmRlZmluZWQgfCBzdHJpbmc7XG4gIGlzb2xhdGlvbkxldmVsOiB0eXBlb2YgSVNPTEFUSU9OX0xFVkVMW2tleW9mIHR5cGVvZiBJU09MQVRJT05fTEVWRUxdO1xuICBsYW5ndWFnZTogc3RyaW5nO1xuICBsb2NhbEFkZHJlc3M6IHVuZGVmaW5lZCB8IHN0cmluZztcbiAgbWF4UmV0cmllc09uVHJhbnNpZW50RXJyb3JzOiBudW1iZXI7XG4gIG11bHRpU3VibmV0RmFpbG92ZXI6IGJvb2xlYW47XG4gIHBhY2tldFNpemU6IG51bWJlcjtcbiAgcG9ydDogdW5kZWZpbmVkIHwgbnVtYmVyO1xuICByZWFkT25seUludGVudDogYm9vbGVhbjtcbiAgcmVxdWVzdFRpbWVvdXQ6IG51bWJlcjtcbiAgcm93Q29sbGVjdGlvbk9uRG9uZTogYm9vbGVhbjtcbiAgcm93Q29sbGVjdGlvbk9uUmVxdWVzdENvbXBsZXRpb246IGJvb2xlYW47XG4gIHNlcnZlck5hbWU6IHVuZGVmaW5lZCB8IHN0cmluZztcbiAgc2VydmVyU3VwcG9ydHNDb2x1bW5FbmNyeXB0aW9uOiBib29sZWFuO1xuICB0ZHNWZXJzaW9uOiBzdHJpbmc7XG4gIHRleHRzaXplOiBudW1iZXI7XG4gIHRydXN0ZWRTZXJ2ZXJOYW1lQUU6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgdHJ1c3RTZXJ2ZXJDZXJ0aWZpY2F0ZTogYm9vbGVhbjtcbiAgdXNlQ29sdW1uTmFtZXM6IGJvb2xlYW47XG4gIHVzZVVUQzogYm9vbGVhbjtcbiAgd29ya3N0YXRpb25JZDogdW5kZWZpbmVkIHwgc3RyaW5nO1xuICBsb3dlckNhc2VHdWlkczogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIEtleVN0b3JlUHJvdmlkZXJNYXAge1xuICBba2V5OiBzdHJpbmddOiBDb2x1bW5FbmNyeXB0aW9uQXp1cmVLZXlWYXVsdFByb3ZpZGVyO1xufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmludGVyZmFjZSBTdGF0ZSB7XG4gIG5hbWU6IHN0cmluZztcbiAgZW50ZXI/KHRoaXM6IENvbm5lY3Rpb24pOiB2b2lkO1xuICBleGl0Pyh0aGlzOiBDb25uZWN0aW9uLCBuZXdTdGF0ZTogU3RhdGUpOiB2b2lkO1xuICBldmVudHM6IHtcbiAgICBzb2NrZXRFcnJvcj8odGhpczogQ29ubmVjdGlvbiwgZXJyOiBFcnJvcik6IHZvaWQ7XG4gICAgbWVzc2FnZT8odGhpczogQ29ubmVjdGlvbiwgbWVzc2FnZTogTWVzc2FnZSk6IHZvaWQ7XG4gIH07XG59XG5cbnR5cGUgQXV0aGVudGljYXRpb24gPSBEZWZhdWx0QXV0aGVudGljYXRpb24gfFxuICBOdGxtQXV0aGVudGljYXRpb24gfFxuICBUb2tlbkNyZWRlbnRpYWxBdXRoZW50aWNhdGlvbiB8XG4gIEF6dXJlQWN0aXZlRGlyZWN0b3J5UGFzc3dvcmRBdXRoZW50aWNhdGlvbiB8XG4gIEF6dXJlQWN0aXZlRGlyZWN0b3J5TXNpQXBwU2VydmljZUF1dGhlbnRpY2F0aW9uIHxcbiAgQXp1cmVBY3RpdmVEaXJlY3RvcnlNc2lWbUF1dGhlbnRpY2F0aW9uIHxcbiAgQXp1cmVBY3RpdmVEaXJlY3RvcnlBY2Nlc3NUb2tlbkF1dGhlbnRpY2F0aW9uIHxcbiAgQXp1cmVBY3RpdmVEaXJlY3RvcnlTZXJ2aWNlUHJpbmNpcGFsU2VjcmV0IHxcbiAgQXp1cmVBY3RpdmVEaXJlY3RvcnlEZWZhdWx0QXV0aGVudGljYXRpb247XG5cbnR5cGUgQXV0aGVudGljYXRpb25UeXBlID0gQXV0aGVudGljYXRpb25bJ3R5cGUnXTtcblxuZXhwb3J0IGludGVyZmFjZSBDb25uZWN0aW9uQ29uZmlndXJhdGlvbiB7XG4gIC8qKlxuICAgKiBIb3N0bmFtZSB0byBjb25uZWN0IHRvLlxuICAgKi9cbiAgc2VydmVyOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBDb25maWd1cmF0aW9uIG9wdGlvbnMgZm9yIGZvcm1pbmcgdGhlIGNvbm5lY3Rpb24uXG4gICAqL1xuICBvcHRpb25zPzogQ29ubmVjdGlvbk9wdGlvbnM7XG4gIC8qKlxuICAgKiBBdXRoZW50aWNhdGlvbiByZWxhdGVkIG9wdGlvbnMgZm9yIGNvbm5lY3Rpb24uXG4gICAqL1xuICBhdXRoZW50aWNhdGlvbj86IEF1dGhlbnRpY2F0aW9uT3B0aW9ucztcbn1cblxuaW50ZXJmYWNlIERlYnVnT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBBIGJvb2xlYW4sIGNvbnRyb2xsaW5nIHdoZXRoZXIgW1tkZWJ1Z11dIGV2ZW50cyB3aWxsIGJlIGVtaXR0ZWQgd2l0aCB0ZXh0IGRlc2NyaWJpbmcgcGFja2V0IGRhdGEgZGV0YWlsc1xuICAgKlxuICAgKiAoZGVmYXVsdDogYGZhbHNlYClcbiAgICovXG4gIGRhdGE6IGJvb2xlYW47XG4gIC8qKlxuICAgKiBBIGJvb2xlYW4sIGNvbnRyb2xsaW5nIHdoZXRoZXIgW1tkZWJ1Z11dIGV2ZW50cyB3aWxsIGJlIGVtaXR0ZWQgd2l0aCB0ZXh0IGRlc2NyaWJpbmcgcGFja2V0IGRldGFpbHNcbiAgICpcbiAgICogKGRlZmF1bHQ6IGBmYWxzZWApXG4gICAqL1xuICBwYWNrZXQ6IGJvb2xlYW47XG4gIC8qKlxuICAgKiBBIGJvb2xlYW4sIGNvbnRyb2xsaW5nIHdoZXRoZXIgW1tkZWJ1Z11dIGV2ZW50cyB3aWxsIGJlIGVtaXR0ZWQgd2l0aCB0ZXh0IGRlc2NyaWJpbmcgcGFja2V0IHBheWxvYWQgZGV0YWlsc1xuICAgKlxuICAgKiAoZGVmYXVsdDogYGZhbHNlYClcbiAgICovXG4gIHBheWxvYWQ6IGJvb2xlYW47XG4gIC8qKlxuICAgKiBBIGJvb2xlYW4sIGNvbnRyb2xsaW5nIHdoZXRoZXIgW1tkZWJ1Z11dIGV2ZW50cyB3aWxsIGJlIGVtaXR0ZWQgd2l0aCB0ZXh0IGRlc2NyaWJpbmcgdG9rZW4gc3RyZWFtIHRva2Vuc1xuICAgKlxuICAgKiAoZGVmYXVsdDogYGZhbHNlYClcbiAgICovXG4gIHRva2VuOiBib29sZWFuO1xufVxuXG5pbnRlcmZhY2UgQXV0aGVudGljYXRpb25PcHRpb25zIHtcbiAgLyoqXG4gICAqIFR5cGUgb2YgdGhlIGF1dGhlbnRpY2F0aW9uIG1ldGhvZCwgdmFsaWQgdHlwZXMgYXJlIGBkZWZhdWx0YCwgYG50bG1gLFxuICAgKiBgYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1wYXNzd29yZGAsIGBhenVyZS1hY3RpdmUtZGlyZWN0b3J5LWFjY2Vzcy10b2tlbmAsXG4gICAqIGBhenVyZS1hY3RpdmUtZGlyZWN0b3J5LW1zaS12bWAsIGBhenVyZS1hY3RpdmUtZGlyZWN0b3J5LW1zaS1hcHAtc2VydmljZWAsXG4gICAqIGBhenVyZS1hY3RpdmUtZGlyZWN0b3J5LWRlZmF1bHRgXG4gICAqIG9yIGBhenVyZS1hY3RpdmUtZGlyZWN0b3J5LXNlcnZpY2UtcHJpbmNpcGFsLXNlY3JldGBcbiAgICovXG4gIHR5cGU/OiBBdXRoZW50aWNhdGlvblR5cGU7XG4gIC8qKlxuICAgKiBEaWZmZXJlbnQgb3B0aW9ucyBmb3IgYXV0aGVudGljYXRpb24gdHlwZXM6XG4gICAqXG4gICAqICogYGRlZmF1bHRgOiBbW0RlZmF1bHRBdXRoZW50aWNhdGlvbi5vcHRpb25zXV1cbiAgICogKiBgbnRsbWAgOltbTnRsbUF1dGhlbnRpY2F0aW9uXV1cbiAgICogKiBgdG9rZW4tY3JlZGVudGlhbGA6IFtbQ3JlZGVudGlhbENoYWluQXV0aGVudGljYXRpb24ub3B0aW9uc11dXG4gICAqICogYGF6dXJlLWFjdGl2ZS1kaXJlY3RvcnktcGFzc3dvcmRgIDogW1tBenVyZUFjdGl2ZURpcmVjdG9yeVBhc3N3b3JkQXV0aGVudGljYXRpb24ub3B0aW9uc11dXG4gICAqICogYGF6dXJlLWFjdGl2ZS1kaXJlY3RvcnktYWNjZXNzLXRva2VuYCA6IFtbQXp1cmVBY3RpdmVEaXJlY3RvcnlBY2Nlc3NUb2tlbkF1dGhlbnRpY2F0aW9uLm9wdGlvbnNdXVxuICAgKiAqIGBhenVyZS1hY3RpdmUtZGlyZWN0b3J5LW1zaS12bWAgOiBbW0F6dXJlQWN0aXZlRGlyZWN0b3J5TXNpVm1BdXRoZW50aWNhdGlvbi5vcHRpb25zXV1cbiAgICogKiBgYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1tc2ktYXBwLXNlcnZpY2VgIDogW1tBenVyZUFjdGl2ZURpcmVjdG9yeU1zaUFwcFNlcnZpY2VBdXRoZW50aWNhdGlvbi5vcHRpb25zXV1cbiAgICogKiBgYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1zZXJ2aWNlLXByaW5jaXBhbC1zZWNyZXRgIDogW1tBenVyZUFjdGl2ZURpcmVjdG9yeVNlcnZpY2VQcmluY2lwYWxTZWNyZXQub3B0aW9uc11dXG4gICAqICogYGF6dXJlLWFjdGl2ZS1kaXJlY3RvcnktZGVmYXVsdGAgOiBbW0F6dXJlQWN0aXZlRGlyZWN0b3J5RGVmYXVsdEF1dGhlbnRpY2F0aW9uLm9wdGlvbnNdXVxuICAgKi9cbiAgb3B0aW9ucz86IGFueTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDb25uZWN0aW9uT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBBIGJvb2xlYW4gZGV0ZXJtaW5pbmcgd2hldGhlciB0byByb2xsYmFjayBhIHRyYW5zYWN0aW9uIGF1dG9tYXRpY2FsbHkgaWYgYW55IGVycm9yIGlzIGVuY291bnRlcmVkXG4gICAqIGR1cmluZyB0aGUgZ2l2ZW4gdHJhbnNhY3Rpb24ncyBleGVjdXRpb24uIFRoaXMgc2V0cyB0aGUgdmFsdWUgZm9yIGBTRVQgWEFDVF9BQk9SVGAgZHVyaW5nIHRoZVxuICAgKiBpbml0aWFsIFNRTCBwaGFzZSBvZiBhIGNvbm5lY3Rpb24gW2RvY3VtZW50YXRpb25dKGh0dHBzOi8vZG9jcy5taWNyb3NvZnQuY29tL2VuLXVzL3NxbC90LXNxbC9zdGF0ZW1lbnRzL3NldC14YWN0LWFib3J0LXRyYW5zYWN0LXNxbCkuXG4gICAqL1xuICBhYm9ydFRyYW5zYWN0aW9uT25FcnJvcj86IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEFwcGxpY2F0aW9uIG5hbWUgdXNlZCBmb3IgaWRlbnRpZnlpbmcgYSBzcGVjaWZpYyBhcHBsaWNhdGlvbiBpbiBwcm9maWxpbmcsIGxvZ2dpbmcgb3IgdHJhY2luZyB0b29scyBvZiBTUUxTZXJ2ZXIuXG4gICAqXG4gICAqIChkZWZhdWx0OiBgVGVkaW91c2ApXG4gICAqL1xuICBhcHBOYW1lPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBBIGJvb2xlYW4sIGNvbnRyb2xsaW5nIHdoZXRoZXIgdGhlIGNvbHVtbiBuYW1lcyByZXR1cm5lZCB3aWxsIGhhdmUgdGhlIGZpcnN0IGxldHRlciBjb252ZXJ0ZWQgdG8gbG93ZXIgY2FzZVxuICAgKiAoYHRydWVgKSBvciBub3QuIFRoaXMgdmFsdWUgaXMgaWdub3JlZCBpZiB5b3UgcHJvdmlkZSBhIFtbY29sdW1uTmFtZVJlcGxhY2VyXV0uXG4gICAqXG4gICAqIChkZWZhdWx0OiBgZmFsc2VgKS5cbiAgICovXG4gIGNhbWVsQ2FzZUNvbHVtbnM/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBiZWZvcmUgdGhlIFtbUmVxdWVzdC5jYW5jZWxdXSAoYWJvcnQpIG9mIGEgcmVxdWVzdCBpcyBjb25zaWRlcmVkIGZhaWxlZFxuICAgKlxuICAgKiAoZGVmYXVsdDogYDUwMDBgKS5cbiAgICovXG4gIGNhbmNlbFRpbWVvdXQ/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEEgZnVuY3Rpb24gd2l0aCBwYXJhbWV0ZXJzIGAoY29sdW1uTmFtZSwgaW5kZXgsIGNvbHVtbk1ldGFEYXRhKWAgYW5kIHJldHVybmluZyBhIHN0cmluZy4gSWYgcHJvdmlkZWQsXG4gICAqIHRoaXMgd2lsbCBiZSBjYWxsZWQgb25jZSBwZXIgY29sdW1uIHBlciByZXN1bHQtc2V0LiBUaGUgcmV0dXJuZWQgdmFsdWUgd2lsbCBiZSB1c2VkIGluc3RlYWQgb2YgdGhlIFNRTC1wcm92aWRlZFxuICAgKiBjb2x1bW4gbmFtZSBvbiByb3cgYW5kIG1ldGEgZGF0YSBvYmplY3RzLiBUaGlzIGFsbG93cyB5b3UgdG8gZHluYW1pY2FsbHkgY29udmVydCBiZXR3ZWVuIG5hbWluZyBjb252ZW50aW9ucy5cbiAgICpcbiAgICogKGRlZmF1bHQ6IGBudWxsYClcbiAgICovXG4gIGNvbHVtbk5hbWVSZXBsYWNlcj86IChjb2xOYW1lOiBzdHJpbmcsIGluZGV4OiBudW1iZXIsIG1ldGFkYXRhOiBNZXRhZGF0YSkgPT4gc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBOdW1iZXIgb2YgbWlsbGlzZWNvbmRzIGJlZm9yZSByZXRyeWluZyB0byBlc3RhYmxpc2ggY29ubmVjdGlvbiwgaW4gY2FzZSBvZiB0cmFuc2llbnQgZmFpbHVyZS5cbiAgICpcbiAgICogKGRlZmF1bHQ6YDUwMGApXG4gICAqL1xuICBjb25uZWN0aW9uUmV0cnlJbnRlcnZhbD86IG51bWJlcjtcblxuICAvKipcbiAgICogQ3VzdG9tIGNvbm5lY3RvciBmYWN0b3J5IG1ldGhvZC5cbiAgICpcbiAgICogKGRlZmF1bHQ6IGB1bmRlZmluZWRgKVxuICAgKi9cbiAgY29ubmVjdG9yPzogKCkgPT4gUHJvbWlzZTxuZXQuU29ja2V0PjtcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgYmVmb3JlIHRoZSBhdHRlbXB0IHRvIGNvbm5lY3QgaXMgY29uc2lkZXJlZCBmYWlsZWRcbiAgICpcbiAgICogKGRlZmF1bHQ6IGAxNTAwMGApLlxuICAgKi9cbiAgY29ubmVjdFRpbWVvdXQ/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBkZWZhdWx0IGlzb2xhdGlvbiBsZXZlbCBmb3IgbmV3IGNvbm5lY3Rpb25zLiBBbGwgb3V0LW9mLXRyYW5zYWN0aW9uIHF1ZXJpZXMgYXJlIGV4ZWN1dGVkIHdpdGggdGhpcyBzZXR0aW5nLlxuICAgKlxuICAgKiBUaGUgaXNvbGF0aW9uIGxldmVscyBhcmUgYXZhaWxhYmxlIGZyb20gYHJlcXVpcmUoJ3RlZGlvdXMnKS5JU09MQVRJT05fTEVWRUxgLlxuICAgKiAqIGBSRUFEX1VOQ09NTUlUVEVEYFxuICAgKiAqIGBSRUFEX0NPTU1JVFRFRGBcbiAgICogKiBgUkVQRUFUQUJMRV9SRUFEYFxuICAgKiAqIGBTRVJJQUxJWkFCTEVgXG4gICAqICogYFNOQVBTSE9UYFxuICAgKlxuICAgKiAoZGVmYXVsdDogYFJFQURfQ09NTUlURURgKS5cbiAgICovXG4gIGNvbm5lY3Rpb25Jc29sYXRpb25MZXZlbD86IG51bWJlcjtcblxuICAvKipcbiAgICogV2hlbiBlbmNyeXB0aW9uIGlzIHVzZWQsIGFuIG9iamVjdCBtYXkgYmUgc3VwcGxpZWQgdGhhdCB3aWxsIGJlIHVzZWRcbiAgICogZm9yIHRoZSBmaXJzdCBhcmd1bWVudCB3aGVuIGNhbGxpbmcgW2B0bHMuY3JlYXRlU2VjdXJlUGFpcmBdKGh0dHA6Ly9ub2RlanMub3JnL2RvY3MvbGF0ZXN0L2FwaS90bHMuaHRtbCN0bHNfdGxzX2NyZWF0ZXNlY3VyZXBhaXJfY3JlZGVudGlhbHNfaXNzZXJ2ZXJfcmVxdWVzdGNlcnRfcmVqZWN0dW5hdXRob3JpemVkKVxuICAgKlxuICAgKiAoZGVmYXVsdDogYHt9YClcbiAgICovXG4gIGNyeXB0b0NyZWRlbnRpYWxzRGV0YWlscz86IFNlY3VyZUNvbnRleHRPcHRpb25zO1xuXG4gIC8qKlxuICAgKiBEYXRhYmFzZSB0byBjb25uZWN0IHRvIChkZWZhdWx0OiBkZXBlbmRlbnQgb24gc2VydmVyIGNvbmZpZ3VyYXRpb24pLlxuICAgKi9cbiAgZGF0YWJhc2U/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGZpcnN0IGRheSBvZiB0aGUgd2VlayB0byBhIG51bWJlciBmcm9tIDEgdGhyb3VnaCA3LlxuICAgKi9cbiAgZGF0ZWZpcnN0PzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBBIHN0cmluZyByZXByZXNlbnRpbmcgcG9zaXRpb24gb2YgbW9udGgsIGRheSBhbmQgeWVhciBpbiB0ZW1wb3JhbCBkYXRhdHlwZXMuXG4gICAqXG4gICAqIChkZWZhdWx0OiBgbWR5YClcbiAgICovXG4gIGRhdGVGb3JtYXQ/OiBzdHJpbmc7XG5cbiAgZGVidWc/OiBEZWJ1Z09wdGlvbnM7XG5cbiAgLyoqXG4gICAqIEEgYm9vbGVhbiwgY29udHJvbHMgdGhlIHdheSBudWxsIHZhbHVlcyBzaG91bGQgYmUgdXNlZCBkdXJpbmcgY29tcGFyaXNvbiBvcGVyYXRpb24uXG4gICAqXG4gICAqIChkZWZhdWx0OiBgdHJ1ZWApXG4gICAqL1xuICBlbmFibGVBbnNpTnVsbD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIElmIHRydWUsIGBTRVQgQU5TSV9OVUxMX0RGTFRfT04gT05gIHdpbGwgYmUgc2V0IGluIHRoZSBpbml0aWFsIHNxbC4gVGhpcyBtZWFucyBuZXcgY29sdW1ucyB3aWxsIGJlXG4gICAqIG51bGxhYmxlIGJ5IGRlZmF1bHQuIFNlZSB0aGUgW1QtU1FMIGRvY3VtZW50YXRpb25dKGh0dHBzOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvbXMxODczNzUuYXNweClcbiAgICpcbiAgICogKGRlZmF1bHQ6IGB0cnVlYCkuXG4gICAqL1xuICBlbmFibGVBbnNpTnVsbERlZmF1bHQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBBIGJvb2xlYW4sIGNvbnRyb2xzIGlmIHBhZGRpbmcgc2hvdWxkIGJlIGFwcGxpZWQgZm9yIHZhbHVlcyBzaG9ydGVyIHRoYW4gdGhlIHNpemUgb2YgZGVmaW5lZCBjb2x1bW4uXG4gICAqXG4gICAqIChkZWZhdWx0OiBgdHJ1ZWApXG4gICAqL1xuICBlbmFibGVBbnNpUGFkZGluZz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIElmIHRydWUsIFNRTCBTZXJ2ZXIgd2lsbCBmb2xsb3cgSVNPIHN0YW5kYXJkIGJlaGF2aW9yIGR1cmluZyB2YXJpb3VzIGVycm9yIGNvbmRpdGlvbnMuIEZvciBkZXRhaWxzLFxuICAgKiBzZWUgW2RvY3VtZW50YXRpb25dKGh0dHBzOi8vZG9jcy5taWNyb3NvZnQuY29tL2VuLXVzL3NxbC90LXNxbC9zdGF0ZW1lbnRzL3NldC1hbnNpLXdhcm5pbmdzLXRyYW5zYWN0LXNxbClcbiAgICpcbiAgICogKGRlZmF1bHQ6IGB0cnVlYClcbiAgICovXG4gIGVuYWJsZUFuc2lXYXJuaW5ncz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEVuZHMgYSBxdWVyeSB3aGVuIGFuIG92ZXJmbG93IG9yIGRpdmlkZS1ieS16ZXJvIGVycm9yIG9jY3VycyBkdXJpbmcgcXVlcnkgZXhlY3V0aW9uLlxuICAgKiBTZWUgW2RvY3VtZW50YXRpb25dKGh0dHBzOi8vZG9jcy5taWNyb3NvZnQuY29tL2VuLXVzL3NxbC90LXNxbC9zdGF0ZW1lbnRzL3NldC1hcml0aGFib3J0LXRyYW5zYWN0LXNxbD92aWV3PXNxbC1zZXJ2ZXItMjAxNylcbiAgICogZm9yIG1vcmUgZGV0YWlscy5cbiAgICpcbiAgICogKGRlZmF1bHQ6IGB0cnVlYClcbiAgICovXG4gIGVuYWJsZUFyaXRoQWJvcnQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBBIGJvb2xlYW4sIGRldGVybWluZXMgaWYgY29uY2F0ZW5hdGlvbiB3aXRoIE5VTEwgc2hvdWxkIHJlc3VsdCBpbiBOVUxMIG9yIGVtcHR5IHN0cmluZyB2YWx1ZSwgbW9yZSBkZXRhaWxzIGluXG4gICAqIFtkb2N1bWVudGF0aW9uXShodHRwczovL2RvY3MubWljcm9zb2Z0LmNvbS9lbi11cy9zcWwvdC1zcWwvc3RhdGVtZW50cy9zZXQtY29uY2F0LW51bGwteWllbGRzLW51bGwtdHJhbnNhY3Qtc3FsKVxuICAgKlxuICAgKiAoZGVmYXVsdDogYHRydWVgKVxuICAgKi9cbiAgZW5hYmxlQ29uY2F0TnVsbFlpZWxkc051bGw/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBBIGJvb2xlYW4sIGNvbnRyb2xzIHdoZXRoZXIgY3Vyc29yIHNob3VsZCBiZSBjbG9zZWQsIGlmIHRoZSB0cmFuc2FjdGlvbiBvcGVuaW5nIGl0IGdldHMgY29tbWl0dGVkIG9yIHJvbGxlZFxuICAgKiBiYWNrLlxuICAgKlxuICAgKiAoZGVmYXVsdDogYG51bGxgKVxuICAgKi9cbiAgZW5hYmxlQ3Vyc29yQ2xvc2VPbkNvbW1pdD86IGJvb2xlYW4gfCBudWxsO1xuXG4gIC8qKlxuICAgKiBBIGJvb2xlYW4sIHNldHMgdGhlIGNvbm5lY3Rpb24gdG8gZWl0aGVyIGltcGxpY2l0IG9yIGF1dG9jb21taXQgdHJhbnNhY3Rpb24gbW9kZS5cbiAgICpcbiAgICogKGRlZmF1bHQ6IGBmYWxzZWApXG4gICAqL1xuICBlbmFibGVJbXBsaWNpdFRyYW5zYWN0aW9ucz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIElmIGZhbHNlLCBlcnJvciBpcyBub3QgZ2VuZXJhdGVkIGR1cmluZyBsb3NzIG9mIHByZWNlc3Npb24uXG4gICAqXG4gICAqIChkZWZhdWx0OiBgZmFsc2VgKVxuICAgKi9cbiAgZW5hYmxlTnVtZXJpY1JvdW5kYWJvcnQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBJZiB0cnVlLCBjaGFyYWN0ZXJzIGVuY2xvc2VkIGluIHNpbmdsZSBxdW90ZXMgYXJlIHRyZWF0ZWQgYXMgbGl0ZXJhbHMgYW5kIHRob3NlIGVuY2xvc2VkIGRvdWJsZSBxdW90ZXMgYXJlIHRyZWF0ZWQgYXMgaWRlbnRpZmllcnMuXG4gICAqXG4gICAqIChkZWZhdWx0OiBgdHJ1ZWApXG4gICAqL1xuICBlbmFibGVRdW90ZWRJZGVudGlmaWVyPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQSBzdHJpbmcgdmFsdWUgdGhhdCBjYW4gYmUgb25seSBzZXQgdG8gJ3N0cmljdCcsIHdoaWNoIGluZGljYXRlcyB0aGUgdXNhZ2UgVERTIDguMCBwcm90b2NvbC4gT3RoZXJ3aXNlLFxuICAgKiBhIGJvb2xlYW4gZGV0ZXJtaW5pbmcgd2hldGhlciBvciBub3QgdGhlIGNvbm5lY3Rpb24gd2lsbCBiZSBlbmNyeXB0ZWQuXG4gICAqXG4gICAqIChkZWZhdWx0OiBgdHJ1ZWApXG4gICAqL1xuICBlbmNyeXB0Pzogc3RyaW5nIHwgYm9vbGVhbjtcblxuICAvKipcbiAgICogQnkgZGVmYXVsdCwgaWYgdGhlIGRhdGFiYXNlIHJlcXVlc3RlZCBieSBbW2RhdGFiYXNlXV0gY2Fubm90IGJlIGFjY2Vzc2VkLFxuICAgKiB0aGUgY29ubmVjdGlvbiB3aWxsIGZhaWwgd2l0aCBhbiBlcnJvci4gSG93ZXZlciwgaWYgW1tmYWxsYmFja1RvRGVmYXVsdERiXV0gaXNcbiAgICogc2V0IHRvIGB0cnVlYCwgdGhlbiB0aGUgdXNlcidzIGRlZmF1bHQgZGF0YWJhc2Ugd2lsbCBiZSB1c2VkIGluc3RlYWRcbiAgICpcbiAgICogKGRlZmF1bHQ6IGBmYWxzZWApXG4gICAqL1xuICBmYWxsYmFja1RvRGVmYXVsdERiPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIGluc3RhbmNlIG5hbWUgdG8gY29ubmVjdCB0by5cbiAgICogVGhlIFNRTCBTZXJ2ZXIgQnJvd3NlciBzZXJ2aWNlIG11c3QgYmUgcnVubmluZyBvbiB0aGUgZGF0YWJhc2Ugc2VydmVyLFxuICAgKiBhbmQgVURQIHBvcnQgMTQzNCBvbiB0aGUgZGF0YWJhc2Ugc2VydmVyIG11c3QgYmUgcmVhY2hhYmxlLlxuICAgKlxuICAgKiAobm8gZGVmYXVsdClcbiAgICpcbiAgICogTXV0dWFsbHkgZXhjbHVzaXZlIHdpdGggW1twb3J0XV0uXG4gICAqL1xuICBpbnN0YW5jZU5hbWU/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIFRoZSBkZWZhdWx0IGlzb2xhdGlvbiBsZXZlbCB0aGF0IHRyYW5zYWN0aW9ucyB3aWxsIGJlIHJ1biB3aXRoLlxuICAgKlxuICAgKiBUaGUgaXNvbGF0aW9uIGxldmVscyBhcmUgYXZhaWxhYmxlIGZyb20gYHJlcXVpcmUoJ3RlZGlvdXMnKS5JU09MQVRJT05fTEVWRUxgLlxuICAgKiAqIGBSRUFEX1VOQ09NTUlUVEVEYFxuICAgKiAqIGBSRUFEX0NPTU1JVFRFRGBcbiAgICogKiBgUkVQRUFUQUJMRV9SRUFEYFxuICAgKiAqIGBTRVJJQUxJWkFCTEVgXG4gICAqICogYFNOQVBTSE9UYFxuICAgKlxuICAgKiAoZGVmYXVsdDogYFJFQURfQ09NTUlURURgKS5cbiAgICovXG4gIGlzb2xhdGlvbkxldmVsPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgdGhlIGxhbmd1YWdlIGVudmlyb25tZW50IGZvciB0aGUgc2Vzc2lvbi4gVGhlIHNlc3Npb24gbGFuZ3VhZ2UgZGV0ZXJtaW5lcyB0aGUgZGF0ZXRpbWUgZm9ybWF0cyBhbmQgc3lzdGVtIG1lc3NhZ2VzLlxuICAgKlxuICAgKiAoZGVmYXVsdDogYHVzX2VuZ2xpc2hgKS5cbiAgICovXG4gIGxhbmd1YWdlPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIHN0cmluZyBpbmRpY2F0aW5nIHdoaWNoIG5ldHdvcmsgaW50ZXJmYWNlIChpcCBhZGRyZXNzKSB0byB1c2Ugd2hlbiBjb25uZWN0aW5nIHRvIFNRTCBTZXJ2ZXIuXG4gICAqL1xuICBsb2NhbEFkZHJlc3M/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEEgYm9vbGVhbiBkZXRlcm1pbmluZyB3aGV0aGVyIHRvIHBhcnNlIHVuaXF1ZSBpZGVudGlmaWVyIHR5cGUgd2l0aCBsb3dlcmNhc2UgY2FzZSBjaGFyYWN0ZXJzLlxuICAgKlxuICAgKiAoZGVmYXVsdDogYGZhbHNlYCkuXG4gICAqL1xuICBsb3dlckNhc2VHdWlkcz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBtYXhpbXVtIG51bWJlciBvZiBjb25uZWN0aW9uIHJldHJpZXMgZm9yIHRyYW5zaWVudCBlcnJvcnMu44CBXG4gICAqXG4gICAqIChkZWZhdWx0OiBgM2ApLlxuICAgKi9cbiAgbWF4UmV0cmllc09uVHJhbnNpZW50RXJyb3JzPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBNdWx0aVN1Ym5ldEZhaWxvdmVyID0gVHJ1ZSBwYXJhbWV0ZXIsIHdoaWNoIGNhbiBoZWxwIG1pbmltaXplIHRoZSBjbGllbnQgcmVjb3ZlcnkgbGF0ZW5jeSB3aGVuIGZhaWxvdmVycyBvY2N1ci5cbiAgICpcbiAgICogKGRlZmF1bHQ6IGBmYWxzZWApLlxuICAgKi9cbiAgbXVsdGlTdWJuZXRGYWlsb3Zlcj86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBzaXplIG9mIFREUyBwYWNrZXRzIChzdWJqZWN0IHRvIG5lZ290aWF0aW9uIHdpdGggdGhlIHNlcnZlcikuXG4gICAqIFNob3VsZCBiZSBhIHBvd2VyIG9mIDIuXG4gICAqXG4gICAqIChkZWZhdWx0OiBgNDA5NmApLlxuICAgKi9cbiAgcGFja2V0U2l6ZT86IG51bWJlcjtcblxuICAvKipcbiAgICogUG9ydCB0byBjb25uZWN0IHRvIChkZWZhdWx0OiBgMTQzM2ApLlxuICAgKlxuICAgKiBNdXR1YWxseSBleGNsdXNpdmUgd2l0aCBbW2luc3RhbmNlTmFtZV1dXG4gICAqL1xuICBwb3J0PzogbnVtYmVyIHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBBIGJvb2xlYW4sIGRldGVybWluaW5nIHdoZXRoZXIgdGhlIGNvbm5lY3Rpb24gd2lsbCByZXF1ZXN0IHJlYWQgb25seSBhY2Nlc3MgZnJvbSBhIFNRTCBTZXJ2ZXIgQXZhaWxhYmlsaXR5XG4gICAqIEdyb3VwLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtoZXJlXShodHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvaGg3MTAwNTQuYXNweCBcIk1pY3Jvc29mdDogQ29uZmlndXJlIFJlYWQtT25seSBSb3V0aW5nIGZvciBhbiBBdmFpbGFiaWxpdHkgR3JvdXAgKFNRTCBTZXJ2ZXIpXCIpXG4gICAqXG4gICAqIChkZWZhdWx0OiBgZmFsc2VgKS5cbiAgICovXG4gIHJlYWRPbmx5SW50ZW50PzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgYmVmb3JlIGEgcmVxdWVzdCBpcyBjb25zaWRlcmVkIGZhaWxlZCwgb3IgYDBgIGZvciBubyB0aW1lb3V0LlxuICAgKlxuICAgKiBBcyBzb29uIGFzIGEgcmVzcG9uc2UgaXMgcmVjZWl2ZWQsIHRoZSB0aW1lb3V0IGlzIGNsZWFyZWQuIFRoaXMgbWVhbnMgdGhhdCBxdWVyaWVzIHRoYXQgaW1tZWRpYXRlbHkgcmV0dXJuIGEgcmVzcG9uc2UgaGF2ZSBhYmlsaXR5IHRvIHJ1biBsb25nZXIgdGhhbiB0aGlzIHRpbWVvdXQuXG4gICAqXG4gICAqIChkZWZhdWx0OiBgMTUwMDBgKS5cbiAgICovXG4gIHJlcXVlc3RUaW1lb3V0PzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBBIGJvb2xlYW4sIHRoYXQgd2hlbiB0cnVlIHdpbGwgZXhwb3NlIHJlY2VpdmVkIHJvd3MgaW4gUmVxdWVzdHMgZG9uZSByZWxhdGVkIGV2ZW50czpcbiAgICogKiBbW1JlcXVlc3QuRXZlbnRfZG9uZUluUHJvY11dXG4gICAqICogW1tSZXF1ZXN0LkV2ZW50X2RvbmVQcm9jXV1cbiAgICogKiBbW1JlcXVlc3QuRXZlbnRfZG9uZV1dXG4gICAqXG4gICAqIChkZWZhdWx0OiBgZmFsc2VgKVxuICAgKlxuICAgKiBDYXV0aW9uOiBJZiBtYW55IHJvdyBhcmUgcmVjZWl2ZWQsIGVuYWJsaW5nIHRoaXMgb3B0aW9uIGNvdWxkIHJlc3VsdCBpblxuICAgKiBleGNlc3NpdmUgbWVtb3J5IHVzYWdlLlxuICAgKi9cbiAgcm93Q29sbGVjdGlvbk9uRG9uZT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEEgYm9vbGVhbiwgdGhhdCB3aGVuIHRydWUgd2lsbCBleHBvc2UgcmVjZWl2ZWQgcm93cyBpbiBSZXF1ZXN0cycgY29tcGxldGlvbiBjYWxsYmFjay5TZWUgW1tSZXF1ZXN0LmNvbnN0cnVjdG9yXV0uXG4gICAqXG4gICAqIChkZWZhdWx0OiBgZmFsc2VgKVxuICAgKlxuICAgKiBDYXV0aW9uOiBJZiBtYW55IHJvdyBhcmUgcmVjZWl2ZWQsIGVuYWJsaW5nIHRoaXMgb3B0aW9uIGNvdWxkIHJlc3VsdCBpblxuICAgKiBleGNlc3NpdmUgbWVtb3J5IHVzYWdlLlxuICAgKi9cbiAgcm93Q29sbGVjdGlvbk9uUmVxdWVzdENvbXBsZXRpb24/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgdmVyc2lvbiBvZiBURFMgdG8gdXNlLiBJZiBzZXJ2ZXIgZG9lc24ndCBzdXBwb3J0IHNwZWNpZmllZCB2ZXJzaW9uLCBuZWdvdGlhdGVkIHZlcnNpb24gaXMgdXNlZCBpbnN0ZWFkLlxuICAgKlxuICAgKiBUaGUgdmVyc2lvbnMgYXJlIGF2YWlsYWJsZSBmcm9tIGByZXF1aXJlKCd0ZWRpb3VzJykuVERTX1ZFUlNJT05gLlxuICAgKiAqIGA3XzFgXG4gICAqICogYDdfMmBcbiAgICogKiBgN18zX0FgXG4gICAqICogYDdfM19CYFxuICAgKiAqIGA3XzRgXG4gICAqXG4gICAqIChkZWZhdWx0OiBgN180YClcbiAgICovXG4gIHRkc1ZlcnNpb24/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyB0aGUgc2l6ZSBvZiB2YXJjaGFyKG1heCksIG52YXJjaGFyKG1heCksIHZhcmJpbmFyeShtYXgpLCB0ZXh0LCBudGV4dCwgYW5kIGltYWdlIGRhdGEgcmV0dXJuZWQgYnkgYSBTRUxFQ1Qgc3RhdGVtZW50LlxuICAgKlxuICAgKiAoZGVmYXVsdDogYDIxNDc0ODM2NDdgKVxuICAgKi9cbiAgdGV4dHNpemU/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIElmIFwidHJ1ZVwiLCB0aGUgU1FMIFNlcnZlciBTU0wgY2VydGlmaWNhdGUgaXMgYXV0b21hdGljYWxseSB0cnVzdGVkIHdoZW4gdGhlIGNvbW11bmljYXRpb24gbGF5ZXIgaXMgZW5jcnlwdGVkIHVzaW5nIFNTTC5cbiAgICpcbiAgICogSWYgXCJmYWxzZVwiLCB0aGUgU1FMIFNlcnZlciB2YWxpZGF0ZXMgdGhlIHNlcnZlciBTU0wgY2VydGlmaWNhdGUuIElmIHRoZSBzZXJ2ZXIgY2VydGlmaWNhdGUgdmFsaWRhdGlvbiBmYWlscyxcbiAgICogdGhlIGRyaXZlciByYWlzZXMgYW4gZXJyb3IgYW5kIHRlcm1pbmF0ZXMgdGhlIGNvbm5lY3Rpb24uIE1ha2Ugc3VyZSB0aGUgdmFsdWUgcGFzc2VkIHRvIHNlcnZlck5hbWUgZXhhY3RseVxuICAgKiBtYXRjaGVzIHRoZSBDb21tb24gTmFtZSAoQ04pIG9yIEROUyBuYW1lIGluIHRoZSBTdWJqZWN0IEFsdGVybmF0ZSBOYW1lIGluIHRoZSBzZXJ2ZXIgY2VydGlmaWNhdGUgZm9yIGFuIFNTTCBjb25uZWN0aW9uIHRvIHN1Y2NlZWQuXG4gICAqXG4gICAqIChkZWZhdWx0OiBgdHJ1ZWApXG4gICAqL1xuICB0cnVzdFNlcnZlckNlcnRpZmljYXRlPzogYm9vbGVhbjtcblxuICAvKipcbiAgICpcbiAgICovXG4gIHNlcnZlck5hbWU/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBBIGJvb2xlYW4gZGV0ZXJtaW5pbmcgd2hldGhlciB0byByZXR1cm4gcm93cyBhcyBhcnJheXMgb3Iga2V5LXZhbHVlIGNvbGxlY3Rpb25zLlxuICAgKlxuICAgKiAoZGVmYXVsdDogYGZhbHNlYCkuXG4gICAqL1xuICB1c2VDb2x1bW5OYW1lcz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEEgYm9vbGVhbiBkZXRlcm1pbmluZyB3aGV0aGVyIHRvIHBhc3MgdGltZSB2YWx1ZXMgaW4gVVRDIG9yIGxvY2FsIHRpbWUuXG4gICAqXG4gICAqIChkZWZhdWx0OiBgdHJ1ZWApLlxuICAgKi9cbiAgdXNlVVRDPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIHdvcmtzdGF0aW9uIElEIChXU0lEKSBvZiB0aGUgY2xpZW50LCBkZWZhdWx0IG9zLmhvc3RuYW1lKCkuXG4gICAqIFVzZWQgZm9yIGlkZW50aWZ5aW5nIGEgc3BlY2lmaWMgY2xpZW50IGluIHByb2ZpbGluZywgbG9nZ2luZyBvclxuICAgKiB0cmFjaW5nIGNsaWVudCBhY3Rpdml0eSBpbiBTUUxTZXJ2ZXIuXG4gICAqXG4gICAqIFRoZSB2YWx1ZSBpcyByZXBvcnRlZCBieSB0aGUgVFNRTCBmdW5jdGlvbiBIT1NUX05BTUUoKS5cbiAgICovXG4gIHdvcmtzdGF0aW9uSWQ/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG59XG5cbmludGVyZmFjZSBSb3V0aW5nRGF0YSB7XG4gIHNlcnZlcjogc3RyaW5nO1xuICBwb3J0OiBudW1iZXI7XG4gIGluc3RhbmNlOiBzdHJpbmc7XG59XG5cbi8qKlxuICogSGVscGVyIGZ1bmN0aW9uLCBlcXVpdmFsZW50IHRvIGBQcm9taXNlLndpdGhSZXNvbHZlcnMoKWAuXG4gKlxuICogQHJldHVybnMgQW4gb2JqZWN0IHdpdGggdGhlIHByb3BlcnRpZXMgYHByb21pc2VgLCBgcmVzb2x2ZWAsIGFuZCBgcmVqZWN0YC5cbiAqL1xuZnVuY3Rpb24gd2l0aFJlc29sdmVyczxUPigpIHtcbiAgbGV0IHJlc29sdmU6ICh2YWx1ZTogVCB8IFByb21pc2VMaWtlPFQ+KSA9PiB2b2lkO1xuICBsZXQgcmVqZWN0OiAocmVhc29uPzogYW55KSA9PiB2b2lkO1xuXG4gIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZTxUPigocmVzLCByZWopID0+IHtcbiAgICByZXNvbHZlID0gcmVzO1xuICAgIHJlamVjdCA9IHJlajtcbiAgfSk7XG5cbiAgcmV0dXJuIHsgcHJvbWlzZSwgcmVzb2x2ZTogcmVzb2x2ZSEsIHJlamVjdDogcmVqZWN0ISB9O1xufVxuXG4vKipcbiAqIEEgW1tDb25uZWN0aW9uXV0gaW5zdGFuY2UgcmVwcmVzZW50cyBhIHNpbmdsZSBjb25uZWN0aW9uIHRvIGEgZGF0YWJhc2Ugc2VydmVyLlxuICpcbiAqIGBgYGpzXG4gKiB2YXIgQ29ubmVjdGlvbiA9IHJlcXVpcmUoJ3RlZGlvdXMnKS5Db25uZWN0aW9uO1xuICogdmFyIGNvbmZpZyA9IHtcbiAqICBcImF1dGhlbnRpY2F0aW9uXCI6IHtcbiAqICAgIC4uLixcbiAqICAgIFwib3B0aW9uc1wiOiB7Li4ufVxuICogIH0sXG4gKiAgXCJvcHRpb25zXCI6IHsuLi59XG4gKiB9O1xuICogdmFyIGNvbm5lY3Rpb24gPSBuZXcgQ29ubmVjdGlvbihjb25maWcpO1xuICogYGBgXG4gKlxuICogT25seSBvbmUgcmVxdWVzdCBhdCBhIHRpbWUgbWF5IGJlIGV4ZWN1dGVkIG9uIGEgY29ubmVjdGlvbi4gT25jZSBhIFtbUmVxdWVzdF1dXG4gKiBoYXMgYmVlbiBpbml0aWF0ZWQgKHdpdGggW1tDb25uZWN0aW9uLmNhbGxQcm9jZWR1cmVdXSwgW1tDb25uZWN0aW9uLmV4ZWNTcWxdXSxcbiAqIG9yIFtbQ29ubmVjdGlvbi5leGVjU3FsQmF0Y2hdXSksIGFub3RoZXIgc2hvdWxkIG5vdCBiZSBpbml0aWF0ZWQgdW50aWwgdGhlXG4gKiBbW1JlcXVlc3RdXSdzIGNvbXBsZXRpb24gY2FsbGJhY2sgaXMgY2FsbGVkLlxuICovXG5jbGFzcyBDb25uZWN0aW9uIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIGZlZEF1dGhSZXF1aXJlZDogYm9vbGVhbjtcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIGNvbmZpZzogSW50ZXJuYWxDb25uZWN0aW9uQ29uZmlnO1xuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRlY2xhcmUgc2VjdXJlQ29udGV4dE9wdGlvbnM6IFNlY3VyZUNvbnRleHRPcHRpb25zO1xuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRlY2xhcmUgaW5UcmFuc2FjdGlvbjogYm9vbGVhbjtcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIHRyYW5zYWN0aW9uRGVzY3JpcHRvcnM6IEJ1ZmZlcltdO1xuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRlY2xhcmUgdHJhbnNhY3Rpb25EZXB0aDogbnVtYmVyO1xuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRlY2xhcmUgaXNTcWxCYXRjaDogYm9vbGVhbjtcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIGN1clRyYW5zaWVudFJldHJ5Q291bnQ6IG51bWJlcjtcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIHRyYW5zaWVudEVycm9yTG9va3VwOiBUcmFuc2llbnRFcnJvckxvb2t1cDtcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIGNsb3NlZDogYm9vbGVhbjtcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIGxvZ2luRXJyb3I6IHVuZGVmaW5lZCB8IEFnZ3JlZ2F0ZUVycm9yIHwgQ29ubmVjdGlvbkVycm9yO1xuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRlY2xhcmUgZGVidWc6IERlYnVnO1xuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRlY2xhcmUgbnRsbXBhY2tldDogdW5kZWZpbmVkIHwgYW55O1xuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRlY2xhcmUgbnRsbXBhY2tldEJ1ZmZlcjogdW5kZWZpbmVkIHwgQnVmZmVyO1xuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZGVjbGFyZSBTVEFURToge1xuICAgIElOSVRJQUxJWkVEOiBTdGF0ZTtcbiAgICBDT05ORUNUSU5HOiBTdGF0ZTtcbiAgICBTRU5UX1BSRUxPR0lOOiBTdGF0ZTtcbiAgICBSRVJPVVRJTkc6IFN0YXRlO1xuICAgIFRSQU5TSUVOVF9GQUlMVVJFX1JFVFJZOiBTdGF0ZTtcbiAgICBTRU5UX1RMU1NTTE5FR09USUFUSU9OOiBTdGF0ZTtcbiAgICBTRU5UX0xPR0lON19XSVRIX1NUQU5EQVJEX0xPR0lOOiBTdGF0ZTtcbiAgICBTRU5UX0xPR0lON19XSVRIX05UTE06IFN0YXRlO1xuICAgIFNFTlRfTE9HSU43X1dJVEhfRkVEQVVUSDogU3RhdGU7XG4gICAgTE9HR0VEX0lOX1NFTkRJTkdfSU5JVElBTF9TUUw6IFN0YXRlO1xuICAgIExPR0dFRF9JTjogU3RhdGU7XG4gICAgU0VOVF9DTElFTlRfUkVRVUVTVDogU3RhdGU7XG4gICAgU0VOVF9BVFRFTlRJT046IFN0YXRlO1xuICAgIEZJTkFMOiBTdGF0ZTtcbiAgfTtcblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRlY2xhcmUgcm91dGluZ0RhdGE6IHVuZGVmaW5lZCB8IFJvdXRpbmdEYXRhO1xuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZGVjbGFyZSBtZXNzYWdlSW86IE1lc3NhZ2VJTztcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIHN0YXRlOiBTdGF0ZTtcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIHJlc2V0Q29ubmVjdGlvbk9uTmV4dFJlcXVlc3Q6IHVuZGVmaW5lZCB8IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIHJlcXVlc3Q6IHVuZGVmaW5lZCB8IFJlcXVlc3QgfCBCdWxrTG9hZDtcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIHByb2NSZXR1cm5TdGF0dXNWYWx1ZTogdW5kZWZpbmVkIHwgYW55O1xuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRlY2xhcmUgc29ja2V0OiB1bmRlZmluZWQgfCBuZXQuU29ja2V0O1xuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRlY2xhcmUgbWVzc2FnZUJ1ZmZlcjogQnVmZmVyO1xuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZGVjbGFyZSBjYW5jZWxUaW1lcjogdW5kZWZpbmVkIHwgTm9kZUpTLlRpbWVvdXQ7XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZGVjbGFyZSByZXF1ZXN0VGltZXI6IHVuZGVmaW5lZCB8IE5vZGVKUy5UaW1lb3V0O1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIGFuIGF0dGVudGlvbiBtZXNzYWdlIHdhcyBzZW50IHRvIHRoZSBzZXJ2ZXIgdG8gY2FuY2VsIHRoZVxuICAgKiBjdXJyZW50bHkgYWN0aXZlIHJlcXVlc3QuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIGF0dGVudGlvblNlbnQ6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIF9jYW5jZWxBZnRlclJlcXVlc3RTZW50OiAoKSA9PiB2b2lkO1xuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZGVjbGFyZSBkYXRhYmFzZUNvbGxhdGlvbjogQ29sbGF0aW9uIHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZGVjbGFyZSBfb25Tb2NrZXRDbG9zZTogKGhhZEVycm9yOiBib29sZWFuKSA9PiB2b2lkO1xuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZGVjbGFyZSBfb25Tb2NrZXRFcnJvcjogKGVycjogRXJyb3IpID0+IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIF9vblNvY2tldEVuZDogKCkgPT4gdm9pZDtcblxuICAvKipcbiAgICogTm90ZTogYmUgYXdhcmUgb2YgdGhlIGRpZmZlcmVudCBvcHRpb25zIGZpZWxkOlxuICAgKiAxLiBjb25maWcuYXV0aGVudGljYXRpb24ub3B0aW9uc1xuICAgKiAyLiBjb25maWcub3B0aW9uc1xuICAgKlxuICAgKiBgYGBqc1xuICAgKiBjb25zdCB7IENvbm5lY3Rpb24gfSA9IHJlcXVpcmUoJ3RlZGlvdXMnKTtcbiAgICpcbiAgICogY29uc3QgY29uZmlnID0ge1xuICAgKiAgXCJhdXRoZW50aWNhdGlvblwiOiB7XG4gICAqICAgIC4uLixcbiAgICogICAgXCJvcHRpb25zXCI6IHsuLi59XG4gICAqICB9LFxuICAgKiAgXCJvcHRpb25zXCI6IHsuLi59XG4gICAqIH07XG4gICAqXG4gICAqIGNvbnN0IGNvbm5lY3Rpb24gPSBuZXcgQ29ubmVjdGlvbihjb25maWcpO1xuICAgKiBgYGBcbiAgICpcbiAgICogQHBhcmFtIGNvbmZpZ1xuICAgKi9cbiAgY29uc3RydWN0b3IoY29uZmlnOiBDb25uZWN0aW9uQ29uZmlndXJhdGlvbikge1xuICAgIHN1cGVyKCk7XG5cbiAgICBpZiAodHlwZW9mIGNvbmZpZyAhPT0gJ29iamVjdCcgfHwgY29uZmlnID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWdcIiBhcmd1bWVudCBpcyByZXF1aXJlZCBhbmQgbXVzdCBiZSBvZiB0eXBlIE9iamVjdC4nKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGNvbmZpZy5zZXJ2ZXIgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcuc2VydmVyXCIgcHJvcGVydHkgaXMgcmVxdWlyZWQgYW5kIG11c3QgYmUgb2YgdHlwZSBzdHJpbmcuJyk7XG4gICAgfVxuXG4gICAgdGhpcy5mZWRBdXRoUmVxdWlyZWQgPSBmYWxzZTtcblxuICAgIGxldCBhdXRoZW50aWNhdGlvbjogQ29ubmVjdGlvbkF1dGhlbnRpY2F0aW9uO1xuICAgIGlmIChjb25maWcuYXV0aGVudGljYXRpb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHR5cGVvZiBjb25maWcuYXV0aGVudGljYXRpb24gIT09ICdvYmplY3QnIHx8IGNvbmZpZy5hdXRoZW50aWNhdGlvbiA9PT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcuYXV0aGVudGljYXRpb25cIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgT2JqZWN0LicpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB0eXBlID0gY29uZmlnLmF1dGhlbnRpY2F0aW9uLnR5cGU7XG4gICAgICBjb25zdCBvcHRpb25zID0gY29uZmlnLmF1dGhlbnRpY2F0aW9uLm9wdGlvbnMgPT09IHVuZGVmaW5lZCA/IHt9IDogY29uZmlnLmF1dGhlbnRpY2F0aW9uLm9wdGlvbnM7XG5cbiAgICAgIGlmICh0eXBlb2YgdHlwZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLmF1dGhlbnRpY2F0aW9uLnR5cGVcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgc3RyaW5nLicpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZSAhPT0gJ2RlZmF1bHQnICYmIHR5cGUgIT09ICdudGxtJyAmJiB0eXBlICE9PSAndG9rZW4tY3JlZGVudGlhbCcgJiYgdHlwZSAhPT0gJ2F6dXJlLWFjdGl2ZS1kaXJlY3RvcnktcGFzc3dvcmQnICYmIHR5cGUgIT09ICdhenVyZS1hY3RpdmUtZGlyZWN0b3J5LWFjY2Vzcy10b2tlbicgJiYgdHlwZSAhPT0gJ2F6dXJlLWFjdGl2ZS1kaXJlY3RvcnktbXNpLXZtJyAmJiB0eXBlICE9PSAnYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1tc2ktYXBwLXNlcnZpY2UnICYmIHR5cGUgIT09ICdhenVyZS1hY3RpdmUtZGlyZWN0b3J5LXNlcnZpY2UtcHJpbmNpcGFsLXNlY3JldCcgJiYgdHlwZSAhPT0gJ2F6dXJlLWFjdGl2ZS1kaXJlY3RvcnktZGVmYXVsdCcpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwidHlwZVwiIHByb3BlcnR5IG11c3Qgb25lIG9mIFwiZGVmYXVsdFwiLCBcIm50bG1cIiwgXCJ0b2tlbi1jcmVkZW50aWFsXCIsIFwiYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1wYXNzd29yZFwiLCBcImF6dXJlLWFjdGl2ZS1kaXJlY3RvcnktYWNjZXNzLXRva2VuXCIsIFwiYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1kZWZhdWx0XCIsIFwiYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1tc2ktdm1cIiBvciBcImF6dXJlLWFjdGl2ZS1kaXJlY3RvcnktbXNpLWFwcC1zZXJ2aWNlXCIgb3IgXCJhenVyZS1hY3RpdmUtZGlyZWN0b3J5LXNlcnZpY2UtcHJpbmNpcGFsLXNlY3JldFwiLicpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMgIT09ICdvYmplY3QnIHx8IG9wdGlvbnMgPT09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLmF1dGhlbnRpY2F0aW9uLm9wdGlvbnNcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgb2JqZWN0LicpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZSA9PT0gJ250bG0nKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5kb21haW4gIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLmF1dGhlbnRpY2F0aW9uLm9wdGlvbnMuZG9tYWluXCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIHN0cmluZy4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRpb25zLnVzZXJOYW1lICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9wdGlvbnMudXNlck5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLmF1dGhlbnRpY2F0aW9uLm9wdGlvbnMudXNlck5hbWVcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgc3RyaW5nLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMucGFzc3dvcmQgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb3B0aW9ucy5wYXNzd29yZCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcuYXV0aGVudGljYXRpb24ub3B0aW9ucy5wYXNzd29yZFwiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBzdHJpbmcuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBhdXRoZW50aWNhdGlvbiA9IHtcbiAgICAgICAgICB0eXBlOiAnbnRsbScsXG4gICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgdXNlck5hbWU6IG9wdGlvbnMudXNlck5hbWUsXG4gICAgICAgICAgICBwYXNzd29yZDogb3B0aW9ucy5wYXNzd29yZCxcbiAgICAgICAgICAgIGRvbWFpbjogb3B0aW9ucy5kb21haW4gJiYgb3B0aW9ucy5kb21haW4udG9VcHBlckNhc2UoKVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3Rva2VuLWNyZWRlbnRpYWwnKSB7XG4gICAgICAgIGlmICghaXNUb2tlbkNyZWRlbnRpYWwob3B0aW9ucy5jcmVkZW50aWFsKSkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5hdXRoZW50aWNhdGlvbi5vcHRpb25zLmNyZWRlbnRpYWxcIiBwcm9wZXJ0eSBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIHRoZSB0b2tlbiBjcmVkZW50aWFsIGNsYXNzLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXV0aGVudGljYXRpb24gPSB7XG4gICAgICAgICAgdHlwZTogJ3Rva2VuLWNyZWRlbnRpYWwnLFxuICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIGNyZWRlbnRpYWw6IG9wdGlvbnMuY3JlZGVudGlhbFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2F6dXJlLWFjdGl2ZS1kaXJlY3RvcnktcGFzc3dvcmQnKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5jbGllbnRJZCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcuYXV0aGVudGljYXRpb24ub3B0aW9ucy5jbGllbnRJZFwiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBzdHJpbmcuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0aW9ucy51c2VyTmFtZSAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvcHRpb25zLnVzZXJOYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5hdXRoZW50aWNhdGlvbi5vcHRpb25zLnVzZXJOYW1lXCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIHN0cmluZy4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRpb25zLnBhc3N3b3JkICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9wdGlvbnMucGFzc3dvcmQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLmF1dGhlbnRpY2F0aW9uLm9wdGlvbnMucGFzc3dvcmRcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgc3RyaW5nLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMudGVuYW50SWQgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb3B0aW9ucy50ZW5hbnRJZCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcuYXV0aGVudGljYXRpb24ub3B0aW9ucy50ZW5hbnRJZFwiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBzdHJpbmcuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBhdXRoZW50aWNhdGlvbiA9IHtcbiAgICAgICAgICB0eXBlOiAnYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1wYXNzd29yZCcsXG4gICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgdXNlck5hbWU6IG9wdGlvbnMudXNlck5hbWUsXG4gICAgICAgICAgICBwYXNzd29yZDogb3B0aW9ucy5wYXNzd29yZCxcbiAgICAgICAgICAgIHRlbmFudElkOiBvcHRpb25zLnRlbmFudElkLFxuICAgICAgICAgICAgY2xpZW50SWQ6IG9wdGlvbnMuY2xpZW50SWRcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdhenVyZS1hY3RpdmUtZGlyZWN0b3J5LWFjY2Vzcy10b2tlbicpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLnRva2VuICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5hdXRoZW50aWNhdGlvbi5vcHRpb25zLnRva2VuXCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIHN0cmluZy4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGF1dGhlbnRpY2F0aW9uID0ge1xuICAgICAgICAgIHR5cGU6ICdhenVyZS1hY3RpdmUtZGlyZWN0b3J5LWFjY2Vzcy10b2tlbicsXG4gICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgdG9rZW46IG9wdGlvbnMudG9rZW5cbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdhenVyZS1hY3RpdmUtZGlyZWN0b3J5LW1zaS12bScpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuY2xpZW50SWQgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb3B0aW9ucy5jbGllbnRJZCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcuYXV0aGVudGljYXRpb24ub3B0aW9ucy5jbGllbnRJZFwiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBzdHJpbmcuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBhdXRoZW50aWNhdGlvbiA9IHtcbiAgICAgICAgICB0eXBlOiAnYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1tc2ktdm0nLFxuICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIGNsaWVudElkOiBvcHRpb25zLmNsaWVudElkXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1kZWZhdWx0Jykge1xuICAgICAgICBpZiAob3B0aW9ucy5jbGllbnRJZCAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvcHRpb25zLmNsaWVudElkICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5hdXRoZW50aWNhdGlvbi5vcHRpb25zLmNsaWVudElkXCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIHN0cmluZy4nKTtcbiAgICAgICAgfVxuICAgICAgICBhdXRoZW50aWNhdGlvbiA9IHtcbiAgICAgICAgICB0eXBlOiAnYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1kZWZhdWx0JyxcbiAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBjbGllbnRJZDogb3B0aW9ucy5jbGllbnRJZFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2F6dXJlLWFjdGl2ZS1kaXJlY3RvcnktbXNpLWFwcC1zZXJ2aWNlJykge1xuICAgICAgICBpZiAob3B0aW9ucy5jbGllbnRJZCAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvcHRpb25zLmNsaWVudElkICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5hdXRoZW50aWNhdGlvbi5vcHRpb25zLmNsaWVudElkXCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIHN0cmluZy4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGF1dGhlbnRpY2F0aW9uID0ge1xuICAgICAgICAgIHR5cGU6ICdhenVyZS1hY3RpdmUtZGlyZWN0b3J5LW1zaS1hcHAtc2VydmljZScsXG4gICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgY2xpZW50SWQ6IG9wdGlvbnMuY2xpZW50SWRcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdhenVyZS1hY3RpdmUtZGlyZWN0b3J5LXNlcnZpY2UtcHJpbmNpcGFsLXNlY3JldCcpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmNsaWVudElkICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5hdXRoZW50aWNhdGlvbi5vcHRpb25zLmNsaWVudElkXCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIHN0cmluZy4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5jbGllbnRTZWNyZXQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLmF1dGhlbnRpY2F0aW9uLm9wdGlvbnMuY2xpZW50U2VjcmV0XCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIHN0cmluZy4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy50ZW5hbnRJZCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcuYXV0aGVudGljYXRpb24ub3B0aW9ucy50ZW5hbnRJZFwiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBzdHJpbmcuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBhdXRoZW50aWNhdGlvbiA9IHtcbiAgICAgICAgICB0eXBlOiAnYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1zZXJ2aWNlLXByaW5jaXBhbC1zZWNyZXQnLFxuICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIGNsaWVudElkOiBvcHRpb25zLmNsaWVudElkLFxuICAgICAgICAgICAgY2xpZW50U2VjcmV0OiBvcHRpb25zLmNsaWVudFNlY3JldCxcbiAgICAgICAgICAgIHRlbmFudElkOiBvcHRpb25zLnRlbmFudElkXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKG9wdGlvbnMudXNlck5hbWUgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb3B0aW9ucy51c2VyTmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcuYXV0aGVudGljYXRpb24ub3B0aW9ucy51c2VyTmFtZVwiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBzdHJpbmcuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0aW9ucy5wYXNzd29yZCAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvcHRpb25zLnBhc3N3b3JkICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5hdXRoZW50aWNhdGlvbi5vcHRpb25zLnBhc3N3b3JkXCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIHN0cmluZy4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGF1dGhlbnRpY2F0aW9uID0ge1xuICAgICAgICAgIHR5cGU6ICdkZWZhdWx0JyxcbiAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICB1c2VyTmFtZTogb3B0aW9ucy51c2VyTmFtZSxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBvcHRpb25zLnBhc3N3b3JkXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBhdXRoZW50aWNhdGlvbiA9IHtcbiAgICAgICAgdHlwZTogJ2RlZmF1bHQnLFxuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgdXNlck5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICBwYXNzd29yZDogdW5kZWZpbmVkXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICBzZXJ2ZXI6IGNvbmZpZy5zZXJ2ZXIsXG4gICAgICBhdXRoZW50aWNhdGlvbjogYXV0aGVudGljYXRpb24sXG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIGFib3J0VHJhbnNhY3Rpb25PbkVycm9yOiBmYWxzZSxcbiAgICAgICAgYXBwTmFtZTogdW5kZWZpbmVkLFxuICAgICAgICBjYW1lbENhc2VDb2x1bW5zOiBmYWxzZSxcbiAgICAgICAgY2FuY2VsVGltZW91dDogREVGQVVMVF9DQU5DRUxfVElNRU9VVCxcbiAgICAgICAgY29sdW1uRW5jcnlwdGlvbktleUNhY2hlVFRMOiAyICogNjAgKiA2MCAqIDEwMDAsICAvLyBVbml0czogbWlsbGlzZWNvbmRzXG4gICAgICAgIGNvbHVtbkVuY3J5cHRpb25TZXR0aW5nOiBmYWxzZSxcbiAgICAgICAgY29sdW1uTmFtZVJlcGxhY2VyOiB1bmRlZmluZWQsXG4gICAgICAgIGNvbm5lY3Rpb25SZXRyeUludGVydmFsOiBERUZBVUxUX0NPTk5FQ1RfUkVUUllfSU5URVJWQUwsXG4gICAgICAgIGNvbm5lY3RUaW1lb3V0OiBERUZBVUxUX0NPTk5FQ1RfVElNRU9VVCxcbiAgICAgICAgY29ubmVjdG9yOiB1bmRlZmluZWQsXG4gICAgICAgIGNvbm5lY3Rpb25Jc29sYXRpb25MZXZlbDogSVNPTEFUSU9OX0xFVkVMLlJFQURfQ09NTUlUVEVELFxuICAgICAgICBjcnlwdG9DcmVkZW50aWFsc0RldGFpbHM6IHt9LFxuICAgICAgICBkYXRhYmFzZTogdW5kZWZpbmVkLFxuICAgICAgICBkYXRlZmlyc3Q6IERFRkFVTFRfREFURUZJUlNULFxuICAgICAgICBkYXRlRm9ybWF0OiBERUZBVUxUX0RBVEVGT1JNQVQsXG4gICAgICAgIGRlYnVnOiB7XG4gICAgICAgICAgZGF0YTogZmFsc2UsXG4gICAgICAgICAgcGFja2V0OiBmYWxzZSxcbiAgICAgICAgICBwYXlsb2FkOiBmYWxzZSxcbiAgICAgICAgICB0b2tlbjogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgZW5hYmxlQW5zaU51bGw6IHRydWUsXG4gICAgICAgIGVuYWJsZUFuc2lOdWxsRGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgZW5hYmxlQW5zaVBhZGRpbmc6IHRydWUsXG4gICAgICAgIGVuYWJsZUFuc2lXYXJuaW5nczogdHJ1ZSxcbiAgICAgICAgZW5hYmxlQXJpdGhBYm9ydDogdHJ1ZSxcbiAgICAgICAgZW5hYmxlQ29uY2F0TnVsbFlpZWxkc051bGw6IHRydWUsXG4gICAgICAgIGVuYWJsZUN1cnNvckNsb3NlT25Db21taXQ6IG51bGwsXG4gICAgICAgIGVuYWJsZUltcGxpY2l0VHJhbnNhY3Rpb25zOiBmYWxzZSxcbiAgICAgICAgZW5hYmxlTnVtZXJpY1JvdW5kYWJvcnQ6IGZhbHNlLFxuICAgICAgICBlbmFibGVRdW90ZWRJZGVudGlmaWVyOiB0cnVlLFxuICAgICAgICBlbmNyeXB0OiB0cnVlLFxuICAgICAgICBmYWxsYmFja1RvRGVmYXVsdERiOiBmYWxzZSxcbiAgICAgICAgZW5jcnlwdGlvbktleVN0b3JlUHJvdmlkZXJzOiB1bmRlZmluZWQsXG4gICAgICAgIGluc3RhbmNlTmFtZTogdW5kZWZpbmVkLFxuICAgICAgICBpc29sYXRpb25MZXZlbDogSVNPTEFUSU9OX0xFVkVMLlJFQURfQ09NTUlUVEVELFxuICAgICAgICBsYW5ndWFnZTogREVGQVVMVF9MQU5HVUFHRSxcbiAgICAgICAgbG9jYWxBZGRyZXNzOiB1bmRlZmluZWQsXG4gICAgICAgIG1heFJldHJpZXNPblRyYW5zaWVudEVycm9yczogMyxcbiAgICAgICAgbXVsdGlTdWJuZXRGYWlsb3ZlcjogZmFsc2UsXG4gICAgICAgIHBhY2tldFNpemU6IERFRkFVTFRfUEFDS0VUX1NJWkUsXG4gICAgICAgIHBvcnQ6IERFRkFVTFRfUE9SVCxcbiAgICAgICAgcmVhZE9ubHlJbnRlbnQ6IGZhbHNlLFxuICAgICAgICByZXF1ZXN0VGltZW91dDogREVGQVVMVF9DTElFTlRfUkVRVUVTVF9USU1FT1VULFxuICAgICAgICByb3dDb2xsZWN0aW9uT25Eb25lOiBmYWxzZSxcbiAgICAgICAgcm93Q29sbGVjdGlvbk9uUmVxdWVzdENvbXBsZXRpb246IGZhbHNlLFxuICAgICAgICBzZXJ2ZXJOYW1lOiB1bmRlZmluZWQsXG4gICAgICAgIHNlcnZlclN1cHBvcnRzQ29sdW1uRW5jcnlwdGlvbjogZmFsc2UsXG4gICAgICAgIHRkc1ZlcnNpb246IERFRkFVTFRfVERTX1ZFUlNJT04sXG4gICAgICAgIHRleHRzaXplOiBERUZBVUxUX1RFWFRTSVpFLFxuICAgICAgICB0cnVzdGVkU2VydmVyTmFtZUFFOiB1bmRlZmluZWQsXG4gICAgICAgIHRydXN0U2VydmVyQ2VydGlmaWNhdGU6IGZhbHNlLFxuICAgICAgICB1c2VDb2x1bW5OYW1lczogZmFsc2UsXG4gICAgICAgIHVzZVVUQzogdHJ1ZSxcbiAgICAgICAgd29ya3N0YXRpb25JZDogdW5kZWZpbmVkLFxuICAgICAgICBsb3dlckNhc2VHdWlkczogZmFsc2VcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKGNvbmZpZy5vcHRpb25zKSB7XG4gICAgICBpZiAoY29uZmlnLm9wdGlvbnMucG9ydCAmJiBjb25maWcub3B0aW9ucy5pbnN0YW5jZU5hbWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQb3J0IGFuZCBpbnN0YW5jZU5hbWUgYXJlIG11dHVhbGx5IGV4Y2x1c2l2ZSwgYnV0ICcgKyBjb25maWcub3B0aW9ucy5wb3J0ICsgJyBhbmQgJyArIGNvbmZpZy5vcHRpb25zLmluc3RhbmNlTmFtZSArICcgcHJvdmlkZWQnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLmFib3J0VHJhbnNhY3Rpb25PbkVycm9yICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub3B0aW9ucy5hYm9ydFRyYW5zYWN0aW9uT25FcnJvciAhPT0gJ2Jvb2xlYW4nICYmIGNvbmZpZy5vcHRpb25zLmFib3J0VHJhbnNhY3Rpb25PbkVycm9yICE9PSBudWxsKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLm9wdGlvbnMuYWJvcnRUcmFuc2FjdGlvbk9uRXJyb3JcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgc3RyaW5nIG9yIG51bGwuJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbmZpZy5vcHRpb25zLmFib3J0VHJhbnNhY3Rpb25PbkVycm9yID0gY29uZmlnLm9wdGlvbnMuYWJvcnRUcmFuc2FjdGlvbk9uRXJyb3I7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcub3B0aW9ucy5hcHBOYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub3B0aW9ucy5hcHBOYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLmFwcE5hbWVcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgc3RyaW5nLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy5hcHBOYW1lID0gY29uZmlnLm9wdGlvbnMuYXBwTmFtZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLmNhbWVsQ2FzZUNvbHVtbnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5vcHRpb25zLmNhbWVsQ2FzZUNvbHVtbnMgIT09ICdib29sZWFuJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLmNhbWVsQ2FzZUNvbHVtbnNcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgYm9vbGVhbi4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29uZmlnLm9wdGlvbnMuY2FtZWxDYXNlQ29sdW1ucyA9IGNvbmZpZy5vcHRpb25zLmNhbWVsQ2FzZUNvbHVtbnM7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcub3B0aW9ucy5jYW5jZWxUaW1lb3V0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub3B0aW9ucy5jYW5jZWxUaW1lb3V0ICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLmNhbmNlbFRpbWVvdXRcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgbnVtYmVyLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy5jYW5jZWxUaW1lb3V0ID0gY29uZmlnLm9wdGlvbnMuY2FuY2VsVGltZW91dDtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLmNvbHVtbk5hbWVSZXBsYWNlcikge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5vcHRpb25zLmNvbHVtbk5hbWVSZXBsYWNlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLmNhbmNlbFRpbWVvdXRcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgZnVuY3Rpb24uJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbmZpZy5vcHRpb25zLmNvbHVtbk5hbWVSZXBsYWNlciA9IGNvbmZpZy5vcHRpb25zLmNvbHVtbk5hbWVSZXBsYWNlcjtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLmNvbm5lY3Rpb25Jc29sYXRpb25MZXZlbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGFzc2VydFZhbGlkSXNvbGF0aW9uTGV2ZWwoY29uZmlnLm9wdGlvbnMuY29ubmVjdGlvbklzb2xhdGlvbkxldmVsLCAnY29uZmlnLm9wdGlvbnMuY29ubmVjdGlvbklzb2xhdGlvbkxldmVsJyk7XG5cbiAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy5jb25uZWN0aW9uSXNvbGF0aW9uTGV2ZWwgPSBjb25maWcub3B0aW9ucy5jb25uZWN0aW9uSXNvbGF0aW9uTGV2ZWw7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcub3B0aW9ucy5jb25uZWN0VGltZW91dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm9wdGlvbnMuY29ubmVjdFRpbWVvdXQgIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLm9wdGlvbnMuY29ubmVjdFRpbWVvdXRcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgbnVtYmVyLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy5jb25uZWN0VGltZW91dCA9IGNvbmZpZy5vcHRpb25zLmNvbm5lY3RUaW1lb3V0O1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLm9wdGlvbnMuY29ubmVjdG9yICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub3B0aW9ucy5jb25uZWN0b3IgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy5jb25uZWN0b3JcIiBwcm9wZXJ0eSBtdXN0IGJlIGEgZnVuY3Rpb24uJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbmZpZy5vcHRpb25zLmNvbm5lY3RvciA9IGNvbmZpZy5vcHRpb25zLmNvbm5lY3RvcjtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLmNyeXB0b0NyZWRlbnRpYWxzRGV0YWlscyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm9wdGlvbnMuY3J5cHRvQ3JlZGVudGlhbHNEZXRhaWxzICE9PSAnb2JqZWN0JyB8fCBjb25maWcub3B0aW9ucy5jcnlwdG9DcmVkZW50aWFsc0RldGFpbHMgPT09IG51bGwpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy5jcnlwdG9DcmVkZW50aWFsc0RldGFpbHNcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgT2JqZWN0LicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy5jcnlwdG9DcmVkZW50aWFsc0RldGFpbHMgPSBjb25maWcub3B0aW9ucy5jcnlwdG9DcmVkZW50aWFsc0RldGFpbHM7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcub3B0aW9ucy5kYXRhYmFzZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm9wdGlvbnMuZGF0YWJhc2UgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLm9wdGlvbnMuZGF0YWJhc2VcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgc3RyaW5nLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy5kYXRhYmFzZSA9IGNvbmZpZy5vcHRpb25zLmRhdGFiYXNlO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLm9wdGlvbnMuZGF0ZWZpcnN0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub3B0aW9ucy5kYXRlZmlyc3QgIT09ICdudW1iZXInICYmIGNvbmZpZy5vcHRpb25zLmRhdGVmaXJzdCAhPT0gbnVsbCkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLmRhdGVmaXJzdFwiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBudW1iZXIuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnLm9wdGlvbnMuZGF0ZWZpcnN0ICE9PSBudWxsICYmIChjb25maWcub3B0aW9ucy5kYXRlZmlyc3QgPCAxIHx8IGNvbmZpZy5vcHRpb25zLmRhdGVmaXJzdCA+IDcpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLmRhdGVmaXJzdFwiIHByb3BlcnR5IG11c3QgYmUgPj0gMSBhbmQgPD0gNycpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy5kYXRlZmlyc3QgPSBjb25maWcub3B0aW9ucy5kYXRlZmlyc3Q7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcub3B0aW9ucy5kYXRlRm9ybWF0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub3B0aW9ucy5kYXRlRm9ybWF0ICE9PSAnc3RyaW5nJyAmJiBjb25maWcub3B0aW9ucy5kYXRlRm9ybWF0ICE9PSBudWxsKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLm9wdGlvbnMuZGF0ZUZvcm1hdFwiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBzdHJpbmcgb3IgbnVsbC4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29uZmlnLm9wdGlvbnMuZGF0ZUZvcm1hdCA9IGNvbmZpZy5vcHRpb25zLmRhdGVGb3JtYXQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcub3B0aW9ucy5kZWJ1Zykge1xuICAgICAgICBpZiAoY29uZmlnLm9wdGlvbnMuZGVidWcuZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub3B0aW9ucy5kZWJ1Zy5kYXRhICE9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLmRlYnVnLmRhdGFcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgYm9vbGVhbi4nKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmNvbmZpZy5vcHRpb25zLmRlYnVnLmRhdGEgPSBjb25maWcub3B0aW9ucy5kZWJ1Zy5kYXRhO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLmRlYnVnLnBhY2tldCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub3B0aW9ucy5kZWJ1Zy5wYWNrZXQgIT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLm9wdGlvbnMuZGVidWcucGFja2V0XCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIGJvb2xlYW4uJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy5kZWJ1Zy5wYWNrZXQgPSBjb25maWcub3B0aW9ucy5kZWJ1Zy5wYWNrZXQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnLm9wdGlvbnMuZGVidWcucGF5bG9hZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub3B0aW9ucy5kZWJ1Zy5wYXlsb2FkICE9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLmRlYnVnLnBheWxvYWRcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgYm9vbGVhbi4nKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmNvbmZpZy5vcHRpb25zLmRlYnVnLnBheWxvYWQgPSBjb25maWcub3B0aW9ucy5kZWJ1Zy5wYXlsb2FkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLmRlYnVnLnRva2VuICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5vcHRpb25zLmRlYnVnLnRva2VuICE9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLmRlYnVnLnRva2VuXCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIGJvb2xlYW4uJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy5kZWJ1Zy50b2tlbiA9IGNvbmZpZy5vcHRpb25zLmRlYnVnLnRva2VuO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcub3B0aW9ucy5lbmFibGVBbnNpTnVsbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm9wdGlvbnMuZW5hYmxlQW5zaU51bGwgIT09ICdib29sZWFuJyAmJiBjb25maWcub3B0aW9ucy5lbmFibGVBbnNpTnVsbCAhPT0gbnVsbCkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLmVuYWJsZUFuc2lOdWxsXCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIGJvb2xlYW4gb3IgbnVsbC4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29uZmlnLm9wdGlvbnMuZW5hYmxlQW5zaU51bGwgPSBjb25maWcub3B0aW9ucy5lbmFibGVBbnNpTnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLmVuYWJsZUFuc2lOdWxsRGVmYXVsdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm9wdGlvbnMuZW5hYmxlQW5zaU51bGxEZWZhdWx0ICE9PSAnYm9vbGVhbicgJiYgY29uZmlnLm9wdGlvbnMuZW5hYmxlQW5zaU51bGxEZWZhdWx0ICE9PSBudWxsKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLm9wdGlvbnMuZW5hYmxlQW5zaU51bGxEZWZhdWx0XCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIGJvb2xlYW4gb3IgbnVsbC4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29uZmlnLm9wdGlvbnMuZW5hYmxlQW5zaU51bGxEZWZhdWx0ID0gY29uZmlnLm9wdGlvbnMuZW5hYmxlQW5zaU51bGxEZWZhdWx0O1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLm9wdGlvbnMuZW5hYmxlQW5zaVBhZGRpbmcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5vcHRpb25zLmVuYWJsZUFuc2lQYWRkaW5nICE9PSAnYm9vbGVhbicgJiYgY29uZmlnLm9wdGlvbnMuZW5hYmxlQW5zaVBhZGRpbmcgIT09IG51bGwpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy5lbmFibGVBbnNpUGFkZGluZ1wiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBib29sZWFuIG9yIG51bGwuJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbmZpZy5vcHRpb25zLmVuYWJsZUFuc2lQYWRkaW5nID0gY29uZmlnLm9wdGlvbnMuZW5hYmxlQW5zaVBhZGRpbmc7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcub3B0aW9ucy5lbmFibGVBbnNpV2FybmluZ3MgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5vcHRpb25zLmVuYWJsZUFuc2lXYXJuaW5ncyAhPT0gJ2Jvb2xlYW4nICYmIGNvbmZpZy5vcHRpb25zLmVuYWJsZUFuc2lXYXJuaW5ncyAhPT0gbnVsbCkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLmVuYWJsZUFuc2lXYXJuaW5nc1wiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBib29sZWFuIG9yIG51bGwuJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbmZpZy5vcHRpb25zLmVuYWJsZUFuc2lXYXJuaW5ncyA9IGNvbmZpZy5vcHRpb25zLmVuYWJsZUFuc2lXYXJuaW5ncztcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLmVuYWJsZUFyaXRoQWJvcnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5vcHRpb25zLmVuYWJsZUFyaXRoQWJvcnQgIT09ICdib29sZWFuJyAmJiBjb25maWcub3B0aW9ucy5lbmFibGVBcml0aEFib3J0ICE9PSBudWxsKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLm9wdGlvbnMuZW5hYmxlQXJpdGhBYm9ydFwiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBib29sZWFuIG9yIG51bGwuJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbmZpZy5vcHRpb25zLmVuYWJsZUFyaXRoQWJvcnQgPSBjb25maWcub3B0aW9ucy5lbmFibGVBcml0aEFib3J0O1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLm9wdGlvbnMuZW5hYmxlQ29uY2F0TnVsbFlpZWxkc051bGwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5vcHRpb25zLmVuYWJsZUNvbmNhdE51bGxZaWVsZHNOdWxsICE9PSAnYm9vbGVhbicgJiYgY29uZmlnLm9wdGlvbnMuZW5hYmxlQ29uY2F0TnVsbFlpZWxkc051bGwgIT09IG51bGwpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy5lbmFibGVDb25jYXROdWxsWWllbGRzTnVsbFwiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBib29sZWFuIG9yIG51bGwuJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbmZpZy5vcHRpb25zLmVuYWJsZUNvbmNhdE51bGxZaWVsZHNOdWxsID0gY29uZmlnLm9wdGlvbnMuZW5hYmxlQ29uY2F0TnVsbFlpZWxkc051bGw7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcub3B0aW9ucy5lbmFibGVDdXJzb3JDbG9zZU9uQ29tbWl0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub3B0aW9ucy5lbmFibGVDdXJzb3JDbG9zZU9uQ29tbWl0ICE9PSAnYm9vbGVhbicgJiYgY29uZmlnLm9wdGlvbnMuZW5hYmxlQ3Vyc29yQ2xvc2VPbkNvbW1pdCAhPT0gbnVsbCkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLmVuYWJsZUN1cnNvckNsb3NlT25Db21taXRcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgYm9vbGVhbiBvciBudWxsLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy5lbmFibGVDdXJzb3JDbG9zZU9uQ29tbWl0ID0gY29uZmlnLm9wdGlvbnMuZW5hYmxlQ3Vyc29yQ2xvc2VPbkNvbW1pdDtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLmVuYWJsZUltcGxpY2l0VHJhbnNhY3Rpb25zICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub3B0aW9ucy5lbmFibGVJbXBsaWNpdFRyYW5zYWN0aW9ucyAhPT0gJ2Jvb2xlYW4nICYmIGNvbmZpZy5vcHRpb25zLmVuYWJsZUltcGxpY2l0VHJhbnNhY3Rpb25zICE9PSBudWxsKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLm9wdGlvbnMuZW5hYmxlSW1wbGljaXRUcmFuc2FjdGlvbnNcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgYm9vbGVhbiBvciBudWxsLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy5lbmFibGVJbXBsaWNpdFRyYW5zYWN0aW9ucyA9IGNvbmZpZy5vcHRpb25zLmVuYWJsZUltcGxpY2l0VHJhbnNhY3Rpb25zO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLm9wdGlvbnMuZW5hYmxlTnVtZXJpY1JvdW5kYWJvcnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5vcHRpb25zLmVuYWJsZU51bWVyaWNSb3VuZGFib3J0ICE9PSAnYm9vbGVhbicgJiYgY29uZmlnLm9wdGlvbnMuZW5hYmxlTnVtZXJpY1JvdW5kYWJvcnQgIT09IG51bGwpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy5lbmFibGVOdW1lcmljUm91bmRhYm9ydFwiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBib29sZWFuIG9yIG51bGwuJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbmZpZy5vcHRpb25zLmVuYWJsZU51bWVyaWNSb3VuZGFib3J0ID0gY29uZmlnLm9wdGlvbnMuZW5hYmxlTnVtZXJpY1JvdW5kYWJvcnQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcub3B0aW9ucy5lbmFibGVRdW90ZWRJZGVudGlmaWVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub3B0aW9ucy5lbmFibGVRdW90ZWRJZGVudGlmaWVyICE9PSAnYm9vbGVhbicgJiYgY29uZmlnLm9wdGlvbnMuZW5hYmxlUXVvdGVkSWRlbnRpZmllciAhPT0gbnVsbCkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLmVuYWJsZVF1b3RlZElkZW50aWZpZXJcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgYm9vbGVhbiBvciBudWxsLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy5lbmFibGVRdW90ZWRJZGVudGlmaWVyID0gY29uZmlnLm9wdGlvbnMuZW5hYmxlUXVvdGVkSWRlbnRpZmllcjtcbiAgICAgIH1cbiAgICAgIGlmIChjb25maWcub3B0aW9ucy5lbmNyeXB0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub3B0aW9ucy5lbmNyeXB0ICE9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICBpZiAoY29uZmlnLm9wdGlvbnMuZW5jcnlwdCAhPT0gJ3N0cmljdCcpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImVuY3J5cHRcIiBwcm9wZXJ0eSBtdXN0IGJlIHNldCB0byBcInN0cmljdFwiLCBvciBvZiB0eXBlIGJvb2xlYW4uJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy5lbmNyeXB0ID0gY29uZmlnLm9wdGlvbnMuZW5jcnlwdDtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLmZhbGxiYWNrVG9EZWZhdWx0RGIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5vcHRpb25zLmZhbGxiYWNrVG9EZWZhdWx0RGIgIT09ICdib29sZWFuJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLmZhbGxiYWNrVG9EZWZhdWx0RGJcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgYm9vbGVhbi4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29uZmlnLm9wdGlvbnMuZmFsbGJhY2tUb0RlZmF1bHREYiA9IGNvbmZpZy5vcHRpb25zLmZhbGxiYWNrVG9EZWZhdWx0RGI7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcub3B0aW9ucy5pbnN0YW5jZU5hbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5vcHRpb25zLmluc3RhbmNlTmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy5pbnN0YW5jZU5hbWVcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgc3RyaW5nLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy5pbnN0YW5jZU5hbWUgPSBjb25maWcub3B0aW9ucy5pbnN0YW5jZU5hbWU7XG4gICAgICAgIHRoaXMuY29uZmlnLm9wdGlvbnMucG9ydCA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLmlzb2xhdGlvbkxldmVsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgYXNzZXJ0VmFsaWRJc29sYXRpb25MZXZlbChjb25maWcub3B0aW9ucy5pc29sYXRpb25MZXZlbCwgJ2NvbmZpZy5vcHRpb25zLmlzb2xhdGlvbkxldmVsJyk7XG5cbiAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy5pc29sYXRpb25MZXZlbCA9IGNvbmZpZy5vcHRpb25zLmlzb2xhdGlvbkxldmVsO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLm9wdGlvbnMubGFuZ3VhZ2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5vcHRpb25zLmxhbmd1YWdlICE9PSAnc3RyaW5nJyAmJiBjb25maWcub3B0aW9ucy5sYW5ndWFnZSAhPT0gbnVsbCkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLmxhbmd1YWdlXCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIHN0cmluZyBvciBudWxsLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy5sYW5ndWFnZSA9IGNvbmZpZy5vcHRpb25zLmxhbmd1YWdlO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLm9wdGlvbnMubG9jYWxBZGRyZXNzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub3B0aW9ucy5sb2NhbEFkZHJlc3MgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLm9wdGlvbnMubG9jYWxBZGRyZXNzXCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIHN0cmluZy4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29uZmlnLm9wdGlvbnMubG9jYWxBZGRyZXNzID0gY29uZmlnLm9wdGlvbnMubG9jYWxBZGRyZXNzO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLm9wdGlvbnMubXVsdGlTdWJuZXRGYWlsb3ZlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm9wdGlvbnMubXVsdGlTdWJuZXRGYWlsb3ZlciAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLm9wdGlvbnMubXVsdGlTdWJuZXRGYWlsb3ZlclwiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBib29sZWFuLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy5tdWx0aVN1Ym5ldEZhaWxvdmVyID0gY29uZmlnLm9wdGlvbnMubXVsdGlTdWJuZXRGYWlsb3ZlcjtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLnBhY2tldFNpemUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5vcHRpb25zLnBhY2tldFNpemUgIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLm9wdGlvbnMucGFja2V0U2l6ZVwiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBudW1iZXIuJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbmZpZy5vcHRpb25zLnBhY2tldFNpemUgPSBjb25maWcub3B0aW9ucy5wYWNrZXRTaXplO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLm9wdGlvbnMucG9ydCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm9wdGlvbnMucG9ydCAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy5wb3J0XCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIG51bWJlci4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWcub3B0aW9ucy5wb3J0IDw9IDAgfHwgY29uZmlnLm9wdGlvbnMucG9ydCA+PSA2NTUzNikge1xuICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy5wb3J0XCIgcHJvcGVydHkgbXVzdCBiZSA+IDAgYW5kIDwgNjU1MzYnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29uZmlnLm9wdGlvbnMucG9ydCA9IGNvbmZpZy5vcHRpb25zLnBvcnQ7XG4gICAgICAgIHRoaXMuY29uZmlnLm9wdGlvbnMuaW5zdGFuY2VOYW1lID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLm9wdGlvbnMucmVhZE9ubHlJbnRlbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5vcHRpb25zLnJlYWRPbmx5SW50ZW50ICE9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy5yZWFkT25seUludGVudFwiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBib29sZWFuLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy5yZWFkT25seUludGVudCA9IGNvbmZpZy5vcHRpb25zLnJlYWRPbmx5SW50ZW50O1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLm9wdGlvbnMucmVxdWVzdFRpbWVvdXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5vcHRpb25zLnJlcXVlc3RUaW1lb3V0ICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLnJlcXVlc3RUaW1lb3V0XCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIG51bWJlci4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29uZmlnLm9wdGlvbnMucmVxdWVzdFRpbWVvdXQgPSBjb25maWcub3B0aW9ucy5yZXF1ZXN0VGltZW91dDtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLm1heFJldHJpZXNPblRyYW5zaWVudEVycm9ycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm9wdGlvbnMubWF4UmV0cmllc09uVHJhbnNpZW50RXJyb3JzICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLm1heFJldHJpZXNPblRyYW5zaWVudEVycm9yc1wiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBudW1iZXIuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnLm9wdGlvbnMubWF4UmV0cmllc09uVHJhbnNpZW50RXJyb3JzIDwgMCkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLm1heFJldHJpZXNPblRyYW5zaWVudEVycm9yc1wiIHByb3BlcnR5IG11c3QgYmUgZXF1YWwgb3IgZ3JlYXRlciB0aGFuIDAuJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbmZpZy5vcHRpb25zLm1heFJldHJpZXNPblRyYW5zaWVudEVycm9ycyA9IGNvbmZpZy5vcHRpb25zLm1heFJldHJpZXNPblRyYW5zaWVudEVycm9ycztcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLmNvbm5lY3Rpb25SZXRyeUludGVydmFsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub3B0aW9ucy5jb25uZWN0aW9uUmV0cnlJbnRlcnZhbCAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy5jb25uZWN0aW9uUmV0cnlJbnRlcnZhbFwiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBudW1iZXIuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnLm9wdGlvbnMuY29ubmVjdGlvblJldHJ5SW50ZXJ2YWwgPD0gMCkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLmNvbm5lY3Rpb25SZXRyeUludGVydmFsXCIgcHJvcGVydHkgbXVzdCBiZSBncmVhdGVyIHRoYW4gMC4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29uZmlnLm9wdGlvbnMuY29ubmVjdGlvblJldHJ5SW50ZXJ2YWwgPSBjb25maWcub3B0aW9ucy5jb25uZWN0aW9uUmV0cnlJbnRlcnZhbDtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLnJvd0NvbGxlY3Rpb25PbkRvbmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5vcHRpb25zLnJvd0NvbGxlY3Rpb25PbkRvbmUgIT09ICdib29sZWFuJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLnJvd0NvbGxlY3Rpb25PbkRvbmVcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgYm9vbGVhbi4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29uZmlnLm9wdGlvbnMucm93Q29sbGVjdGlvbk9uRG9uZSA9IGNvbmZpZy5vcHRpb25zLnJvd0NvbGxlY3Rpb25PbkRvbmU7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcub3B0aW9ucy5yb3dDb2xsZWN0aW9uT25SZXF1ZXN0Q29tcGxldGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm9wdGlvbnMucm93Q29sbGVjdGlvbk9uUmVxdWVzdENvbXBsZXRpb24gIT09ICdib29sZWFuJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLnJvd0NvbGxlY3Rpb25PblJlcXVlc3RDb21wbGV0aW9uXCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIGJvb2xlYW4uJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbmZpZy5vcHRpb25zLnJvd0NvbGxlY3Rpb25PblJlcXVlc3RDb21wbGV0aW9uID0gY29uZmlnLm9wdGlvbnMucm93Q29sbGVjdGlvbk9uUmVxdWVzdENvbXBsZXRpb247XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcub3B0aW9ucy50ZHNWZXJzaW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub3B0aW9ucy50ZHNWZXJzaW9uICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLnRkc1ZlcnNpb25cIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgc3RyaW5nLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy50ZHNWZXJzaW9uID0gY29uZmlnLm9wdGlvbnMudGRzVmVyc2lvbjtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLnRleHRzaXplICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub3B0aW9ucy50ZXh0c2l6ZSAhPT0gJ251bWJlcicgJiYgY29uZmlnLm9wdGlvbnMudGV4dHNpemUgIT09IG51bGwpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy50ZXh0c2l6ZVwiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBudW1iZXIgb3IgbnVsbC4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWcub3B0aW9ucy50ZXh0c2l6ZSA+IDIxNDc0ODM2NDcpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy50ZXh0c2l6ZVwiIGNhblxcJ3QgYmUgZ3JlYXRlciB0aGFuIDIxNDc0ODM2NDcuJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoY29uZmlnLm9wdGlvbnMudGV4dHNpemUgPCAtMSkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLnRleHRzaXplXCIgY2FuXFwndCBiZSBzbWFsbGVyIHRoYW4gLTEuJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbmZpZy5vcHRpb25zLnRleHRzaXplID0gY29uZmlnLm9wdGlvbnMudGV4dHNpemUgfCAwO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLm9wdGlvbnMudHJ1c3RTZXJ2ZXJDZXJ0aWZpY2F0ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm9wdGlvbnMudHJ1c3RTZXJ2ZXJDZXJ0aWZpY2F0ZSAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLm9wdGlvbnMudHJ1c3RTZXJ2ZXJDZXJ0aWZpY2F0ZVwiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBib29sZWFuLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy50cnVzdFNlcnZlckNlcnRpZmljYXRlID0gY29uZmlnLm9wdGlvbnMudHJ1c3RTZXJ2ZXJDZXJ0aWZpY2F0ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLnNlcnZlck5hbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5vcHRpb25zLnNlcnZlck5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLm9wdGlvbnMuc2VydmVyTmFtZVwiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBzdHJpbmcuJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy5zZXJ2ZXJOYW1lID0gY29uZmlnLm9wdGlvbnMuc2VydmVyTmFtZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLnVzZUNvbHVtbk5hbWVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub3B0aW9ucy51c2VDb2x1bW5OYW1lcyAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiY29uZmlnLm9wdGlvbnMudXNlQ29sdW1uTmFtZXNcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgYm9vbGVhbi4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29uZmlnLm9wdGlvbnMudXNlQ29sdW1uTmFtZXMgPSBjb25maWcub3B0aW9ucy51c2VDb2x1bW5OYW1lcztcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5vcHRpb25zLnVzZVVUQyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm9wdGlvbnMudXNlVVRDICE9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy51c2VVVENcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgYm9vbGVhbi4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29uZmlnLm9wdGlvbnMudXNlVVRDID0gY29uZmlnLm9wdGlvbnMudXNlVVRDO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLm9wdGlvbnMud29ya3N0YXRpb25JZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm9wdGlvbnMud29ya3N0YXRpb25JZCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjb25maWcub3B0aW9ucy53b3Jrc3RhdGlvbklkXCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIHN0cmluZy4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29uZmlnLm9wdGlvbnMud29ya3N0YXRpb25JZCA9IGNvbmZpZy5vcHRpb25zLndvcmtzdGF0aW9uSWQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcub3B0aW9ucy5sb3dlckNhc2VHdWlkcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm9wdGlvbnMubG93ZXJDYXNlR3VpZHMgIT09ICdib29sZWFuJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImNvbmZpZy5vcHRpb25zLmxvd2VyQ2FzZUd1aWRzXCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIGJvb2xlYW4uJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbmZpZy5vcHRpb25zLmxvd2VyQ2FzZUd1aWRzID0gY29uZmlnLm9wdGlvbnMubG93ZXJDYXNlR3VpZHM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zZWN1cmVDb250ZXh0T3B0aW9ucyA9IHRoaXMuY29uZmlnLm9wdGlvbnMuY3J5cHRvQ3JlZGVudGlhbHNEZXRhaWxzO1xuICAgIGlmICh0aGlzLnNlY3VyZUNvbnRleHRPcHRpb25zLnNlY3VyZU9wdGlvbnMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gSWYgdGhlIGNhbGxlciBoYXMgbm90IHNwZWNpZmllZCB0aGVpciBvd24gYHNlY3VyZU9wdGlvbnNgLFxuICAgICAgLy8gd2Ugc2V0IGBTU0xfT1BfRE9OVF9JTlNFUlRfRU1QVFlfRlJBR01FTlRTYCBoZXJlLlxuICAgICAgLy8gT2xkZXIgU1FMIFNlcnZlciBpbnN0YW5jZXMgcnVubmluZyBvbiBvbGRlciBXaW5kb3dzIHZlcnNpb25zIGhhdmVcbiAgICAgIC8vIHRyb3VibGUgd2l0aCB0aGUgQkVBU1Qgd29ya2Fyb3VuZCBpbiBPcGVuU1NMLlxuICAgICAgLy8gQXMgQkVBU1QgaXMgYSBicm93c2VyIHNwZWNpZmljIGV4cGxvaXQsIHdlIGNhbiBqdXN0IGRpc2FibGUgdGhpcyBvcHRpb24gaGVyZS5cbiAgICAgIHRoaXMuc2VjdXJlQ29udGV4dE9wdGlvbnMgPSBPYmplY3QuY3JlYXRlKHRoaXMuc2VjdXJlQ29udGV4dE9wdGlvbnMsIHtcbiAgICAgICAgc2VjdXJlT3B0aW9uczoge1xuICAgICAgICAgIHZhbHVlOiBjb25zdGFudHMuU1NMX09QX0RPTlRfSU5TRVJUX0VNUFRZX0ZSQUdNRU5UU1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLmRlYnVnID0gdGhpcy5jcmVhdGVEZWJ1ZygpO1xuICAgIHRoaXMuaW5UcmFuc2FjdGlvbiA9IGZhbHNlO1xuICAgIHRoaXMudHJhbnNhY3Rpb25EZXNjcmlwdG9ycyA9IFtCdWZmZXIuZnJvbShbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0pXTtcblxuICAgIC8vICdiZWdpblRyYW5zYWN0aW9uJywgJ2NvbW1pdFRyYW5zYWN0aW9uJyBhbmQgJ3JvbGxiYWNrVHJhbnNhY3Rpb24nXG4gICAgLy8gZXZlbnRzIGFyZSB1dGlsaXplZCB0byBtYWludGFpbiBpblRyYW5zYWN0aW9uIHByb3BlcnR5IHN0YXRlIHdoaWNoIGluXG4gICAgLy8gdHVybiBpcyB1c2VkIGluIG1hbmFnaW5nIHRyYW5zYWN0aW9ucy4gVGhlc2UgZXZlbnRzIGFyZSBvbmx5IGZpcmVkIGZvclxuICAgIC8vIFREUyB2ZXJzaW9uIDcuMiBhbmQgYmV5b25kLiBUaGUgcHJvcGVydGllcyBiZWxvdyBhcmUgdXNlZCB0byBlbXVsYXRlXG4gICAgLy8gZXF1aXZhbGVudCBiZWhhdmlvciBmb3IgVERTIHZlcnNpb25zIGJlZm9yZSA3LjIuXG4gICAgdGhpcy50cmFuc2FjdGlvbkRlcHRoID0gMDtcbiAgICB0aGlzLmlzU3FsQmF0Y2ggPSBmYWxzZTtcbiAgICB0aGlzLmNsb3NlZCA9IGZhbHNlO1xuICAgIHRoaXMubWVzc2FnZUJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygwKTtcblxuICAgIHRoaXMuY3VyVHJhbnNpZW50UmV0cnlDb3VudCA9IDA7XG4gICAgdGhpcy50cmFuc2llbnRFcnJvckxvb2t1cCA9IG5ldyBUcmFuc2llbnRFcnJvckxvb2t1cCgpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHRoaXMuU1RBVEUuSU5JVElBTElaRUQ7XG5cbiAgICB0aGlzLmF0dGVudGlvblNlbnQgPSBmYWxzZTtcblxuICAgIHRoaXMuX2NhbmNlbEFmdGVyUmVxdWVzdFNlbnQgPSAoKSA9PiB7XG4gICAgICB0aGlzLm1lc3NhZ2VJby5zZW5kTWVzc2FnZShUWVBFLkFUVEVOVElPTik7XG4gICAgICB0aGlzLmF0dGVudGlvblNlbnQgPSB0cnVlO1xuICAgICAgdGhpcy5jcmVhdGVDYW5jZWxUaW1lcigpO1xuICAgIH07XG5cbiAgICB0aGlzLl9vblNvY2tldENsb3NlID0gKCkgPT4ge1xuICAgICAgdGhpcy5zb2NrZXRDbG9zZSgpO1xuICAgIH07XG5cbiAgICB0aGlzLl9vblNvY2tldEVuZCA9ICgpID0+IHtcbiAgICAgIHRoaXMuc29ja2V0RW5kKCk7XG4gICAgfTtcblxuICAgIHRoaXMuX29uU29ja2V0RXJyb3IgPSAoZXJyb3IpID0+IHtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnc29ja2V0RXJyb3InLCBlcnJvcik7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIHRoaXMud3JhcFNvY2tldEVycm9yKGVycm9yKSk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9XG5cbiAgY29ubmVjdChjb25uZWN0TGlzdGVuZXI/OiAoZXJyPzogRXJyb3IpID0+IHZvaWQpIHtcbiAgICBpZiAodGhpcy5zdGF0ZSAhPT0gdGhpcy5TVEFURS5JTklUSUFMSVpFRCkge1xuICAgICAgdGhyb3cgbmV3IENvbm5lY3Rpb25FcnJvcignYC5jb25uZWN0YCBjYW4gbm90IGJlIGNhbGxlZCBvbiBhIENvbm5lY3Rpb24gaW4gYCcgKyB0aGlzLnN0YXRlLm5hbWUgKyAnYCBzdGF0ZS4nKTtcbiAgICB9XG5cbiAgICBpZiAoY29ubmVjdExpc3RlbmVyKSB7XG4gICAgICBjb25zdCBvbkNvbm5lY3QgPSAoZXJyPzogRXJyb3IpID0+IHtcbiAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBvbkVycm9yKTtcbiAgICAgICAgY29ubmVjdExpc3RlbmVyKGVycik7XG4gICAgICB9O1xuXG4gICAgICBjb25zdCBvbkVycm9yID0gKGVycjogRXJyb3IpID0+IHtcbiAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignY29ubmVjdCcsIG9uQ29ubmVjdCk7XG4gICAgICAgIGNvbm5lY3RMaXN0ZW5lcihlcnIpO1xuICAgICAgfTtcblxuICAgICAgdGhpcy5vbmNlKCdjb25uZWN0Jywgb25Db25uZWN0KTtcbiAgICAgIHRoaXMub25jZSgnZXJyb3InLCBvbkVycm9yKTtcbiAgICB9XG5cbiAgICB0aGlzLnRyYW5zaXRpb25Ubyh0aGlzLlNUQVRFLkNPTk5FQ1RJTkcpO1xuICAgIHRoaXMuaW5pdGlhbGlzZUNvbm5lY3Rpb24oKS50aGVuKCgpID0+IHtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge1xuICAgICAgICB0aGlzLmVtaXQoJ2Nvbm5lY3QnKTtcbiAgICAgIH0pO1xuICAgIH0sIChlcnIpID0+IHtcbiAgICAgIHRoaXMudHJhbnNpdGlvblRvKHRoaXMuU1RBVEUuRklOQUwpO1xuICAgICAgdGhpcy5jbG9zZWQgPSB0cnVlO1xuXG4gICAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0KCdjb25uZWN0JywgZXJyKTtcbiAgICAgIH0pO1xuICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7XG4gICAgICAgIHRoaXMuZW1pdCgnZW5kJyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgc2VydmVyIGhhcyByZXBvcnRlZCB0aGF0IHRoZSBjaGFyc2V0IGhhcyBjaGFuZ2VkLlxuICAgKi9cbiAgb24oZXZlbnQ6ICdjaGFyc2V0Q2hhbmdlJywgbGlzdGVuZXI6IChjaGFyc2V0OiBzdHJpbmcpID0+IHZvaWQpOiB0aGlzXG5cbiAgLyoqXG4gICAqIFRoZSBhdHRlbXB0IHRvIGNvbm5lY3QgYW5kIHZhbGlkYXRlIGhhcyBjb21wbGV0ZWQuXG4gICAqL1xuICBvbihcbiAgICBldmVudDogJ2Nvbm5lY3QnLFxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBlcnIgSWYgc3VjY2Vzc2Z1bGx5IGNvbm5lY3RlZCwgd2lsbCBiZSBmYWxzZXkuIElmIHRoZXJlIHdhcyBhXG4gICAgICogICBwcm9ibGVtICh3aXRoIGVpdGhlciBjb25uZWN0aW5nIG9yIHZhbGlkYXRpb24pLCB3aWxsIGJlIGFuIFtbRXJyb3JdXSBvYmplY3QuXG4gICAgICovXG4gICAgbGlzdGVuZXI6IChlcnI6IEVycm9yIHwgdW5kZWZpbmVkKSA9PiB2b2lkXG4gICk6IHRoaXNcblxuICAvKipcbiAgICogVGhlIHNlcnZlciBoYXMgcmVwb3J0ZWQgdGhhdCB0aGUgYWN0aXZlIGRhdGFiYXNlIGhhcyBjaGFuZ2VkLlxuICAgKiBUaGlzIG1heSBiZSBhcyBhIHJlc3VsdCBvZiBhIHN1Y2Nlc3NmdWwgbG9naW4sIG9yIGEgYHVzZWAgc3RhdGVtZW50LlxuICAgKi9cbiAgb24oZXZlbnQ6ICdkYXRhYmFzZUNoYW5nZScsIGxpc3RlbmVyOiAoZGF0YWJhc2VOYW1lOiBzdHJpbmcpID0+IHZvaWQpOiB0aGlzXG5cbiAgLyoqXG4gICAqIEEgZGVidWcgbWVzc2FnZSBpcyBhdmFpbGFibGUuIEl0IG1heSBiZSBsb2dnZWQgb3IgaWdub3JlZC5cbiAgICovXG4gIG9uKGV2ZW50OiAnZGVidWcnLCBsaXN0ZW5lcjogKG1lc3NhZ2VUZXh0OiBzdHJpbmcpID0+IHZvaWQpOiB0aGlzXG5cbiAgLyoqXG4gICAqIEludGVybmFsIGVycm9yIG9jY3Vycy5cbiAgICovXG4gIG9uKGV2ZW50OiAnZXJyb3InLCBsaXN0ZW5lcjogKGVycjogRXJyb3IpID0+IHZvaWQpOiB0aGlzXG5cbiAgLyoqXG4gICAqIFRoZSBzZXJ2ZXIgaGFzIGlzc3VlZCBhbiBlcnJvciBtZXNzYWdlLlxuICAgKi9cbiAgb24oZXZlbnQ6ICdlcnJvck1lc3NhZ2UnLCBsaXN0ZW5lcjogKG1lc3NhZ2U6IGltcG9ydCgnLi90b2tlbi90b2tlbicpLkVycm9yTWVzc2FnZVRva2VuKSA9PiB2b2lkKTogdGhpc1xuXG4gIC8qKlxuICAgKiBUaGUgY29ubmVjdGlvbiBoYXMgZW5kZWQuXG4gICAqXG4gICAqIFRoaXMgbWF5IGJlIGFzIGEgcmVzdWx0IG9mIHRoZSBjbGllbnQgY2FsbGluZyBbW2Nsb3NlXV0sIHRoZSBzZXJ2ZXJcbiAgICogY2xvc2luZyB0aGUgY29ubmVjdGlvbiwgb3IgYSBuZXR3b3JrIGVycm9yLlxuICAgKi9cbiAgb24oZXZlbnQ6ICdlbmQnLCBsaXN0ZW5lcjogKCkgPT4gdm9pZCk6IHRoaXNcblxuICAvKipcbiAgICogVGhlIHNlcnZlciBoYXMgaXNzdWVkIGFuIGluZm9ybWF0aW9uIG1lc3NhZ2UuXG4gICAqL1xuICBvbihldmVudDogJ2luZm9NZXNzYWdlJywgbGlzdGVuZXI6IChtZXNzYWdlOiBpbXBvcnQoJy4vdG9rZW4vdG9rZW4nKS5JbmZvTWVzc2FnZVRva2VuKSA9PiB2b2lkKTogdGhpc1xuXG4gIC8qKlxuICAgKiBUaGUgc2VydmVyIGhhcyByZXBvcnRlZCB0aGF0IHRoZSBsYW5ndWFnZSBoYXMgY2hhbmdlZC5cbiAgICovXG4gIG9uKGV2ZW50OiAnbGFuZ3VhZ2VDaGFuZ2UnLCBsaXN0ZW5lcjogKGxhbmd1YWdlTmFtZTogc3RyaW5nKSA9PiB2b2lkKTogdGhpc1xuXG4gIC8qKlxuICAgKiBUaGUgY29ubmVjdGlvbiB3YXMgcmVzZXQuXG4gICAqL1xuICBvbihldmVudDogJ3Jlc2V0Q29ubmVjdGlvbicsIGxpc3RlbmVyOiAoKSA9PiB2b2lkKTogdGhpc1xuXG4gIC8qKlxuICAgKiBBIHNlY3VyZSBjb25uZWN0aW9uIGhhcyBiZWVuIGVzdGFibGlzaGVkLlxuICAgKi9cbiAgb24oZXZlbnQ6ICdzZWN1cmUnLCBsaXN0ZW5lcjogKGNsZWFydGV4dDogaW1wb3J0KCd0bHMnKS5UTFNTb2NrZXQpID0+IHZvaWQpOiB0aGlzXG5cbiAgb24oZXZlbnQ6IHN0cmluZyB8IHN5bWJvbCwgbGlzdGVuZXI6ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZCkge1xuICAgIHJldHVybiBzdXBlci5vbihldmVudCwgbGlzdGVuZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBlbWl0KGV2ZW50OiAnY2hhcnNldENoYW5nZScsIGNoYXJzZXQ6IHN0cmluZyk6IGJvb2xlYW5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBlbWl0KGV2ZW50OiAnY29ubmVjdCcsIGVycm9yPzogRXJyb3IpOiBib29sZWFuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZW1pdChldmVudDogJ2RhdGFiYXNlQ2hhbmdlJywgZGF0YWJhc2VOYW1lOiBzdHJpbmcpOiBib29sZWFuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZW1pdChldmVudDogJ2RhdGFiYXNlTWlycm9yaW5nUGFydG5lcicsIHBhcnRuZXJJbnN0YW5jZU5hbWU6IHN0cmluZyk6IGJvb2xlYW5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBlbWl0KGV2ZW50OiAnZGVidWcnLCBtZXNzYWdlVGV4dDogc3RyaW5nKTogYm9vbGVhblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGVtaXQoZXZlbnQ6ICdlcnJvcicsIGVycm9yOiBFcnJvcik6IGJvb2xlYW5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBlbWl0KGV2ZW50OiAnZXJyb3JNZXNzYWdlJywgbWVzc2FnZTogaW1wb3J0KCcuL3Rva2VuL3Rva2VuJykuRXJyb3JNZXNzYWdlVG9rZW4pOiBib29sZWFuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZW1pdChldmVudDogJ2VuZCcpOiBib29sZWFuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZW1pdChldmVudDogJ2luZm9NZXNzYWdlJywgbWVzc2FnZTogaW1wb3J0KCcuL3Rva2VuL3Rva2VuJykuSW5mb01lc3NhZ2VUb2tlbik6IGJvb2xlYW5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBlbWl0KGV2ZW50OiAnbGFuZ3VhZ2VDaGFuZ2UnLCBsYW5ndWFnZU5hbWU6IHN0cmluZyk6IGJvb2xlYW5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBlbWl0KGV2ZW50OiAnc2VjdXJlJywgY2xlYXJ0ZXh0OiBpbXBvcnQoJ3RscycpLlRMU1NvY2tldCk6IGJvb2xlYW5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBlbWl0KGV2ZW50OiAncmVyb3V0aW5nJyk6IGJvb2xlYW5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBlbWl0KGV2ZW50OiAncmVzZXRDb25uZWN0aW9uJyk6IGJvb2xlYW5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBlbWl0KGV2ZW50OiAncmV0cnknKTogYm9vbGVhblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGVtaXQoZXZlbnQ6ICdyb2xsYmFja1RyYW5zYWN0aW9uJyk6IGJvb2xlYW5cblxuICBlbWl0KGV2ZW50OiBzdHJpbmcgfCBzeW1ib2wsIC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgcmV0dXJuIHN1cGVyLmVtaXQoZXZlbnQsIC4uLmFyZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsb3NlcyB0aGUgY29ubmVjdGlvbiB0byB0aGUgZGF0YWJhc2UuXG4gICAqXG4gICAqIFRoZSBbW0V2ZW50X2VuZF1dIHdpbGwgYmUgZW1pdHRlZCBvbmNlIHRoZSBjb25uZWN0aW9uIGhhcyBiZWVuIGNsb3NlZC5cbiAgICovXG4gIGNsb3NlKCkge1xuICAgIHRoaXMudHJhbnNpdGlvblRvKHRoaXMuU1RBVEUuRklOQUwpO1xuICAgIHRoaXMuY2xlYW51cENvbm5lY3Rpb24oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgYXN5bmMgaW5pdGlhbGlzZUNvbm5lY3Rpb24oKSB7XG4gICAgY29uc3QgdGltZW91dENvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG5cbiAgICBjb25zdCBjb25uZWN0VGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNvbnN0IGhvc3RQb3N0Zml4ID0gdGhpcy5jb25maWcub3B0aW9ucy5wb3J0ID8gYDoke3RoaXMuY29uZmlnLm9wdGlvbnMucG9ydH1gIDogYFxcXFwke3RoaXMuY29uZmlnLm9wdGlvbnMuaW5zdGFuY2VOYW1lfWA7XG4gICAgICAvLyBJZiB3ZSBoYXZlIHJvdXRpbmcgZGF0YSBzdG9yZWQsIHRoaXMgY29ubmVjdGlvbiBoYXMgYmVlbiByZWRpcmVjdGVkXG4gICAgICBjb25zdCBzZXJ2ZXIgPSB0aGlzLnJvdXRpbmdEYXRhID8gdGhpcy5yb3V0aW5nRGF0YS5zZXJ2ZXIgOiB0aGlzLmNvbmZpZy5zZXJ2ZXI7XG4gICAgICBjb25zdCBwb3J0ID0gdGhpcy5yb3V0aW5nRGF0YSA/IGA6JHt0aGlzLnJvdXRpbmdEYXRhLnBvcnR9YCA6IGhvc3RQb3N0Zml4O1xuICAgICAgLy8gR3JhYiB0aGUgdGFyZ2V0IGhvc3QgZnJvbSB0aGUgY29ubmVjdGlvbiBjb25maWd1cmF0aW9uLCBhbmQgZnJvbSBhIHJlZGlyZWN0IG1lc3NhZ2VcbiAgICAgIC8vIG90aGVyd2lzZSwgbGVhdmUgdGhlIG1lc3NhZ2UgZW1wdHkuXG4gICAgICBjb25zdCByb3V0aW5nTWVzc2FnZSA9IHRoaXMucm91dGluZ0RhdGEgPyBgIChyZWRpcmVjdGVkIGZyb20gJHt0aGlzLmNvbmZpZy5zZXJ2ZXJ9JHtob3N0UG9zdGZpeH0pYCA6ICcnO1xuICAgICAgY29uc3QgbWVzc2FnZSA9IGBGYWlsZWQgdG8gY29ubmVjdCB0byAke3NlcnZlcn0ke3BvcnR9JHtyb3V0aW5nTWVzc2FnZX0gaW4gJHt0aGlzLmNvbmZpZy5vcHRpb25zLmNvbm5lY3RUaW1lb3V0fW1zYDtcbiAgICAgIHRoaXMuZGVidWcubG9nKG1lc3NhZ2UpO1xuXG4gICAgICB0aW1lb3V0Q29udHJvbGxlci5hYm9ydChuZXcgQ29ubmVjdGlvbkVycm9yKG1lc3NhZ2UsICdFVElNRU9VVCcpKTtcbiAgICB9LCB0aGlzLmNvbmZpZy5vcHRpb25zLmNvbm5lY3RUaW1lb3V0KTtcblxuICAgIHRyeSB7XG4gICAgICBsZXQgc2lnbmFsID0gdGltZW91dENvbnRyb2xsZXIuc2lnbmFsO1xuXG4gICAgICBsZXQgcG9ydCA9IHRoaXMuY29uZmlnLm9wdGlvbnMucG9ydDtcblxuICAgICAgaWYgKCFwb3J0KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcG9ydCA9IGF3YWl0IGluc3RhbmNlTG9va3VwKHtcbiAgICAgICAgICAgIHNlcnZlcjogdGhpcy5jb25maWcuc2VydmVyLFxuICAgICAgICAgICAgaW5zdGFuY2VOYW1lOiB0aGlzLmNvbmZpZy5vcHRpb25zLmluc3RhbmNlTmFtZSEsXG4gICAgICAgICAgICB0aW1lb3V0OiB0aGlzLmNvbmZpZy5vcHRpb25zLmNvbm5lY3RUaW1lb3V0LFxuICAgICAgICAgICAgc2lnbmFsOiBzaWduYWxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgICAgICBzaWduYWwudGhyb3dJZkFib3J0ZWQoKTtcblxuICAgICAgICAgIHRocm93IG5ldyBDb25uZWN0aW9uRXJyb3IoZXJyLm1lc3NhZ2UsICdFSU5TVExPT0tVUCcsIHsgY2F1c2U6IGVyciB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsZXQgc29ja2V0O1xuICAgICAgdHJ5IHtcbiAgICAgICAgc29ja2V0ID0gYXdhaXQgdGhpcy5jb25uZWN0T25Qb3J0KHBvcnQsIHRoaXMuY29uZmlnLm9wdGlvbnMubXVsdGlTdWJuZXRGYWlsb3Zlciwgc2lnbmFsLCB0aGlzLmNvbmZpZy5vcHRpb25zLmNvbm5lY3Rvcik7XG4gICAgICB9IGNhdGNoIChlcnI6IGFueSkge1xuICAgICAgICBzaWduYWwudGhyb3dJZkFib3J0ZWQoKTtcblxuICAgICAgICB0aHJvdyB0aGlzLndyYXBTb2NrZXRFcnJvcihlcnIpO1xuICAgICAgfVxuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBjb250cm9sbGVyID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAgICAgICBjb25zdCBvbkVycm9yID0gKGVycjogRXJyb3IpID0+IHtcbiAgICAgICAgICBjb250cm9sbGVyLmFib3J0KHRoaXMud3JhcFNvY2tldEVycm9yKGVycikpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBvbkNsb3NlID0gKCkgPT4ge1xuICAgICAgICAgIHRoaXMuZGVidWcubG9nKCdjb25uZWN0aW9uIHRvICcgKyB0aGlzLmNvbmZpZy5zZXJ2ZXIgKyAnOicgKyB0aGlzLmNvbmZpZy5vcHRpb25zLnBvcnQgKyAnIGNsb3NlZCcpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBvbkVuZCA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmRlYnVnLmxvZygnc29ja2V0IGVuZGVkJyk7XG5cbiAgICAgICAgICBjb25zdCBlcnJvcjogRXJyb3JXaXRoQ29kZSA9IG5ldyBFcnJvcignc29ja2V0IGhhbmcgdXAnKTtcbiAgICAgICAgICBlcnJvci5jb2RlID0gJ0VDT05OUkVTRVQnO1xuICAgICAgICAgIGNvbnRyb2xsZXIuYWJvcnQodGhpcy53cmFwU29ja2V0RXJyb3IoZXJyb3IpKTtcbiAgICAgICAgfTtcblxuICAgICAgICBzb2NrZXQub25jZSgnZXJyb3InLCBvbkVycm9yKTtcbiAgICAgICAgc29ja2V0Lm9uY2UoJ2Nsb3NlJywgb25DbG9zZSk7XG4gICAgICAgIHNvY2tldC5vbmNlKCdlbmQnLCBvbkVuZCk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBzaWduYWwgPSBBYm9ydFNpZ25hbC5hbnkoW3NpZ25hbCwgY29udHJvbGxlci5zaWduYWxdKTtcblxuICAgICAgICAgIHNvY2tldC5zZXRLZWVwQWxpdmUodHJ1ZSwgS0VFUF9BTElWRV9JTklUSUFMX0RFTEFZKTtcblxuICAgICAgICAgIHRoaXMubWVzc2FnZUlvID0gbmV3IE1lc3NhZ2VJTyhzb2NrZXQsIHRoaXMuY29uZmlnLm9wdGlvbnMucGFja2V0U2l6ZSwgdGhpcy5kZWJ1Zyk7XG4gICAgICAgICAgdGhpcy5tZXNzYWdlSW8ub24oJ3NlY3VyZScsIChjbGVhcnRleHQpID0+IHsgdGhpcy5lbWl0KCdzZWN1cmUnLCBjbGVhcnRleHQpOyB9KTtcblxuICAgICAgICAgIHRoaXMuc29ja2V0ID0gc29ja2V0O1xuXG4gICAgICAgICAgdGhpcy5jbG9zZWQgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLmRlYnVnLmxvZygnY29ubmVjdGVkIHRvICcgKyB0aGlzLmNvbmZpZy5zZXJ2ZXIgKyAnOicgKyB0aGlzLmNvbmZpZy5vcHRpb25zLnBvcnQpO1xuXG4gICAgICAgICAgdGhpcy5zZW5kUHJlTG9naW4oKTtcblxuICAgICAgICAgIHRoaXMudHJhbnNpdGlvblRvKHRoaXMuU1RBVEUuU0VOVF9QUkVMT0dJTik7XG4gICAgICAgICAgY29uc3QgcHJlbG9naW5SZXNwb25zZSA9IGF3YWl0IHRoaXMucmVhZFByZWxvZ2luUmVzcG9uc2Uoc2lnbmFsKTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBlcmZvcm1UbHNOZWdvdGlhdGlvbihwcmVsb2dpblJlc3BvbnNlLCBzaWduYWwpO1xuXG4gICAgICAgICAgdGhpcy5zZW5kTG9naW43UGFja2V0KCk7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyBhdXRoZW50aWNhdGlvbiB9ID0gdGhpcy5jb25maWc7XG4gICAgICAgICAgICBzd2l0Y2ggKGF1dGhlbnRpY2F0aW9uLnR5cGUpIHtcbiAgICAgICAgICAgICAgY2FzZSAndG9rZW4tY3JlZGVudGlhbCc6XG4gICAgICAgICAgICAgIGNhc2UgJ2F6dXJlLWFjdGl2ZS1kaXJlY3RvcnktcGFzc3dvcmQnOlxuICAgICAgICAgICAgICBjYXNlICdhenVyZS1hY3RpdmUtZGlyZWN0b3J5LW1zaS12bSc6XG4gICAgICAgICAgICAgIGNhc2UgJ2F6dXJlLWFjdGl2ZS1kaXJlY3RvcnktbXNpLWFwcC1zZXJ2aWNlJzpcbiAgICAgICAgICAgICAgY2FzZSAnYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1zZXJ2aWNlLXByaW5jaXBhbC1zZWNyZXQnOlxuICAgICAgICAgICAgICBjYXNlICdhenVyZS1hY3RpdmUtZGlyZWN0b3J5LWRlZmF1bHQnOlxuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvblRvKHRoaXMuU1RBVEUuU0VOVF9MT0dJTjdfV0lUSF9GRURBVVRIKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRpbmdEYXRhID0gYXdhaXQgdGhpcy5wZXJmb3JtU2VudExvZ2luN1dpdGhGZWRBdXRoKHNpZ25hbCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ250bG0nOlxuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvblRvKHRoaXMuU1RBVEUuU0VOVF9MT0dJTjdfV0lUSF9OVExNKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRpbmdEYXRhID0gYXdhaXQgdGhpcy5wZXJmb3JtU2VudExvZ2luN1dpdGhOVExNTG9naW4oc2lnbmFsKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zaXRpb25Ubyh0aGlzLlNUQVRFLlNFTlRfTE9HSU43X1dJVEhfU1RBTkRBUkRfTE9HSU4pO1xuICAgICAgICAgICAgICAgIHRoaXMucm91dGluZ0RhdGEgPSBhd2FpdCB0aGlzLnBlcmZvcm1TZW50TG9naW43V2l0aFN0YW5kYXJkTG9naW4oc2lnbmFsKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIChlcnI6IGFueSkge1xuICAgICAgICAgICAgaWYgKGlzVHJhbnNpZW50RXJyb3IoZXJyKSkge1xuICAgICAgICAgICAgICB0aGlzLmRlYnVnLmxvZygnSW5pdGlhdGluZyByZXRyeSBvbiB0cmFuc2llbnQgZXJyb3InKTtcbiAgICAgICAgICAgICAgdGhpcy50cmFuc2l0aW9uVG8odGhpcy5TVEFURS5UUkFOU0lFTlRfRkFJTFVSRV9SRVRSWSk7XG4gICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnBlcmZvcm1UcmFuc2llbnRGYWlsdXJlUmV0cnkoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIElmIHJvdXRpbmcgZGF0YSBpcyBwcmVzZW50LCB3ZSBuZWVkIHRvIHJlLXJvdXRlIHRoZSBjb25uZWN0aW9uXG4gICAgICAgICAgaWYgKHRoaXMucm91dGluZ0RhdGEpIHtcbiAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvblRvKHRoaXMuU1RBVEUuUkVST1VUSU5HKTtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnBlcmZvcm1SZVJvdXRpbmcoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnRyYW5zaXRpb25Ubyh0aGlzLlNUQVRFLkxPR0dFRF9JTl9TRU5ESU5HX0lOSVRJQUxfU1FMKTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBlcmZvcm1Mb2dnZWRJblNlbmRpbmdJbml0aWFsU3FsKHNpZ25hbCk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgc29ja2V0LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIG9uRXJyb3IpO1xuICAgICAgICAgIHNvY2tldC5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCBvbkNsb3NlKTtcbiAgICAgICAgICBzb2NrZXQucmVtb3ZlTGlzdGVuZXIoJ2VuZCcsIG9uRW5kKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHNvY2tldC5kZXN0cm95KCk7XG5cbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuXG4gICAgICBzb2NrZXQub24oJ2Vycm9yJywgdGhpcy5fb25Tb2NrZXRFcnJvcik7XG4gICAgICBzb2NrZXQub24oJ2Nsb3NlJywgdGhpcy5fb25Tb2NrZXRDbG9zZSk7XG4gICAgICBzb2NrZXQub24oJ2VuZCcsIHRoaXMuX29uU29ja2V0RW5kKTtcblxuICAgICAgdGhpcy50cmFuc2l0aW9uVG8odGhpcy5TVEFURS5MT0dHRURfSU4pO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBjbGVhclRpbWVvdXQoY29ubmVjdFRpbWVyKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNsZWFudXBDb25uZWN0aW9uKCkge1xuICAgIGlmICghdGhpcy5jbG9zZWQpIHtcbiAgICAgIHRoaXMuY2xlYXJSZXF1ZXN0VGltZXIoKTtcbiAgICAgIHRoaXMuY2xlYXJDYW5jZWxUaW1lcigpO1xuICAgICAgdGhpcy5jbG9zZUNvbm5lY3Rpb24oKTtcblxuICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7XG4gICAgICAgIHRoaXMuZW1pdCgnZW5kJyk7XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgcmVxdWVzdCA9IHRoaXMucmVxdWVzdDtcbiAgICAgIGlmIChyZXF1ZXN0KSB7XG4gICAgICAgIGNvbnN0IGVyciA9IG5ldyBSZXF1ZXN0RXJyb3IoJ0Nvbm5lY3Rpb24gY2xvc2VkIGJlZm9yZSByZXF1ZXN0IGNvbXBsZXRlZC4nLCAnRUNMT1NFJyk7XG4gICAgICAgIHJlcXVlc3QuY2FsbGJhY2soZXJyKTtcbiAgICAgICAgdGhpcy5yZXF1ZXN0ID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmF0dGVudGlvblNlbnQgPSBmYWxzZTtcbiAgICAgIHRoaXMuY2xvc2VkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNyZWF0ZURlYnVnKCkge1xuICAgIGNvbnN0IGRlYnVnID0gbmV3IERlYnVnKHRoaXMuY29uZmlnLm9wdGlvbnMuZGVidWcpO1xuICAgIGRlYnVnLm9uKCdkZWJ1ZycsIChtZXNzYWdlKSA9PiB7XG4gICAgICB0aGlzLmVtaXQoJ2RlYnVnJywgbWVzc2FnZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGRlYnVnO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjcmVhdGVUb2tlblN0cmVhbVBhcnNlcihtZXNzYWdlOiBNZXNzYWdlLCBoYW5kbGVyOiBUb2tlbkhhbmRsZXIpIHtcbiAgICByZXR1cm4gbmV3IFRva2VuU3RyZWFtUGFyc2VyKG1lc3NhZ2UsIHRoaXMuZGVidWcsIGhhbmRsZXIsIHRoaXMuY29uZmlnLm9wdGlvbnMpO1xuICB9XG5cbiAgYXN5bmMgd3JhcFdpdGhUbHMoc29ja2V0OiBuZXQuU29ja2V0LCBzaWduYWw6IEFib3J0U2lnbmFsKTogUHJvbWlzZTx0bHMuVExTU29ja2V0PiB7XG4gICAgc2lnbmFsLnRocm93SWZBYm9ydGVkKCk7XG5cbiAgICBjb25zdCBzZWN1cmVDb250ZXh0ID0gdGxzLmNyZWF0ZVNlY3VyZUNvbnRleHQodGhpcy5zZWN1cmVDb250ZXh0T3B0aW9ucyk7XG4gICAgLy8gSWYgY29ubmVjdCB0byBhbiBpcCBhZGRyZXNzIGRpcmVjdGx5LFxuICAgIC8vIG5lZWQgdG8gc2V0IHRoZSBzZXJ2ZXJuYW1lIHRvIGFuIGVtcHR5IHN0cmluZ1xuICAgIC8vIGlmIHRoZSB1c2VyIGhhcyBub3QgZ2l2ZW4gYSBzZXJ2ZXJuYW1lIGV4cGxpY2l0bHlcbiAgICBjb25zdCBzZXJ2ZXJOYW1lID0gIW5ldC5pc0lQKHRoaXMuY29uZmlnLnNlcnZlcikgPyB0aGlzLmNvbmZpZy5zZXJ2ZXIgOiAnJztcbiAgICBjb25zdCBlbmNyeXB0T3B0aW9ucyA9IHtcbiAgICAgIGhvc3Q6IHRoaXMuY29uZmlnLnNlcnZlcixcbiAgICAgIHNvY2tldDogc29ja2V0LFxuICAgICAgQUxQTlByb3RvY29sczogWyd0ZHMvOC4wJ10sXG4gICAgICBzZWN1cmVDb250ZXh0OiBzZWN1cmVDb250ZXh0LFxuICAgICAgc2VydmVybmFtZTogdGhpcy5jb25maWcub3B0aW9ucy5zZXJ2ZXJOYW1lID8gdGhpcy5jb25maWcub3B0aW9ucy5zZXJ2ZXJOYW1lIDogc2VydmVyTmFtZSxcbiAgICB9O1xuXG4gICAgY29uc3QgeyBwcm9taXNlLCByZXNvbHZlLCByZWplY3QgfSA9IHdpdGhSZXNvbHZlcnM8dGxzLlRMU1NvY2tldD4oKTtcbiAgICBjb25zdCBlbmNyeXB0c29ja2V0ID0gdGxzLmNvbm5lY3QoZW5jcnlwdE9wdGlvbnMpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG9uQWJvcnQgPSAoKSA9PiB7IHJlamVjdChzaWduYWwucmVhc29uKTsgfTtcbiAgICAgIHNpZ25hbC5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsIG9uQWJvcnQsIHsgb25jZTogdHJ1ZSB9KTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3Qgb25FcnJvciA9IHJlamVjdDtcbiAgICAgICAgY29uc3Qgb25Db25uZWN0ID0gKCkgPT4geyByZXNvbHZlKGVuY3J5cHRzb2NrZXQpOyB9O1xuXG4gICAgICAgIGVuY3J5cHRzb2NrZXQub25jZSgnZXJyb3InLCBvbkVycm9yKTtcbiAgICAgICAgZW5jcnlwdHNvY2tldC5vbmNlKCdzZWN1cmVDb25uZWN0Jywgb25Db25uZWN0KTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBhd2FpdCBwcm9taXNlO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIGVuY3J5cHRzb2NrZXQucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgb25FcnJvcik7XG4gICAgICAgICAgZW5jcnlwdHNvY2tldC5yZW1vdmVMaXN0ZW5lcignY29ubmVjdCcsIG9uQ29ubmVjdCk7XG4gICAgICAgIH1cbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIG9uQWJvcnQpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICBlbmNyeXB0c29ja2V0LmRlc3Ryb3koKTtcblxuICAgICAgdGhyb3cgZXJyO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGNvbm5lY3RPblBvcnQocG9ydDogbnVtYmVyLCBtdWx0aVN1Ym5ldEZhaWxvdmVyOiBib29sZWFuLCBzaWduYWw6IEFib3J0U2lnbmFsLCBjdXN0b21Db25uZWN0b3I/OiAoKSA9PiBQcm9taXNlPG5ldC5Tb2NrZXQ+KSB7XG4gICAgY29uc3QgY29ubmVjdE9wdHMgPSB7XG4gICAgICBob3N0OiB0aGlzLnJvdXRpbmdEYXRhID8gdGhpcy5yb3V0aW5nRGF0YS5zZXJ2ZXIgOiB0aGlzLmNvbmZpZy5zZXJ2ZXIsXG4gICAgICBwb3J0OiB0aGlzLnJvdXRpbmdEYXRhID8gdGhpcy5yb3V0aW5nRGF0YS5wb3J0IDogcG9ydCxcbiAgICAgIGxvY2FsQWRkcmVzczogdGhpcy5jb25maWcub3B0aW9ucy5sb2NhbEFkZHJlc3NcbiAgICB9O1xuXG4gICAgY29uc3QgY29ubmVjdCA9IGN1c3RvbUNvbm5lY3RvciB8fCAobXVsdGlTdWJuZXRGYWlsb3ZlciA/IGNvbm5lY3RJblBhcmFsbGVsIDogY29ubmVjdEluU2VxdWVuY2UpO1xuXG4gICAgbGV0IHNvY2tldCA9IGF3YWl0IGNvbm5lY3QoY29ubmVjdE9wdHMsIGRucy5sb29rdXAsIHNpZ25hbCk7XG5cbiAgICBpZiAodGhpcy5jb25maWcub3B0aW9ucy5lbmNyeXB0ID09PSAnc3RyaWN0Jykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gV3JhcCB0aGUgc29ja2V0IHdpdGggVExTIGZvciBURFMgOC4wXG4gICAgICAgIHNvY2tldCA9IGF3YWl0IHRoaXMud3JhcFdpdGhUbHMoc29ja2V0LCBzaWduYWwpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHNvY2tldC5lbmQoKTtcblxuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHNvY2tldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY2xvc2VDb25uZWN0aW9uKCkge1xuICAgIGlmICh0aGlzLnNvY2tldCkge1xuICAgICAgdGhpcy5zb2NrZXQuZGVzdHJveSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY3JlYXRlQ2FuY2VsVGltZXIoKSB7XG4gICAgdGhpcy5jbGVhckNhbmNlbFRpbWVyKCk7XG4gICAgY29uc3QgdGltZW91dCA9IHRoaXMuY29uZmlnLm9wdGlvbnMuY2FuY2VsVGltZW91dDtcbiAgICBpZiAodGltZW91dCA+IDApIHtcbiAgICAgIHRoaXMuY2FuY2VsVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5jYW5jZWxUaW1lb3V0KCk7XG4gICAgICB9LCB0aW1lb3V0KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNyZWF0ZVJlcXVlc3RUaW1lcigpIHtcbiAgICB0aGlzLmNsZWFyUmVxdWVzdFRpbWVyKCk7IC8vIHJlbGVhc2Ugb2xkIHRpbWVyLCBqdXN0IHRvIGJlIHNhZmVcbiAgICBjb25zdCByZXF1ZXN0ID0gdGhpcy5yZXF1ZXN0IGFzIFJlcXVlc3Q7XG4gICAgY29uc3QgdGltZW91dCA9IChyZXF1ZXN0LnRpbWVvdXQgIT09IHVuZGVmaW5lZCkgPyByZXF1ZXN0LnRpbWVvdXQgOiB0aGlzLmNvbmZpZy5vcHRpb25zLnJlcXVlc3RUaW1lb3V0O1xuICAgIGlmICh0aW1lb3V0KSB7XG4gICAgICB0aGlzLnJlcXVlc3RUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLnJlcXVlc3RUaW1lb3V0KCk7XG4gICAgICB9LCB0aW1lb3V0KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNhbmNlbFRpbWVvdXQoKSB7XG4gICAgY29uc3QgbWVzc2FnZSA9IGBGYWlsZWQgdG8gY2FuY2VsIHJlcXVlc3QgaW4gJHt0aGlzLmNvbmZpZy5vcHRpb25zLmNhbmNlbFRpbWVvdXR9bXNgO1xuICAgIHRoaXMuZGVidWcubG9nKG1lc3NhZ2UpO1xuICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnc29ja2V0RXJyb3InLCBuZXcgQ29ubmVjdGlvbkVycm9yKG1lc3NhZ2UsICdFVElNRU9VVCcpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVxdWVzdFRpbWVvdXQoKSB7XG4gICAgdGhpcy5yZXF1ZXN0VGltZXIgPSB1bmRlZmluZWQ7XG4gICAgY29uc3QgcmVxdWVzdCA9IHRoaXMucmVxdWVzdCE7XG4gICAgcmVxdWVzdC5jYW5jZWwoKTtcbiAgICBjb25zdCB0aW1lb3V0ID0gKHJlcXVlc3QudGltZW91dCAhPT0gdW5kZWZpbmVkKSA/IHJlcXVlc3QudGltZW91dCA6IHRoaXMuY29uZmlnLm9wdGlvbnMucmVxdWVzdFRpbWVvdXQ7XG4gICAgY29uc3QgbWVzc2FnZSA9ICdUaW1lb3V0OiBSZXF1ZXN0IGZhaWxlZCB0byBjb21wbGV0ZSBpbiAnICsgdGltZW91dCArICdtcyc7XG4gICAgcmVxdWVzdC5lcnJvciA9IG5ldyBSZXF1ZXN0RXJyb3IobWVzc2FnZSwgJ0VUSU1FT1VUJyk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNsZWFyQ2FuY2VsVGltZXIoKSB7XG4gICAgaWYgKHRoaXMuY2FuY2VsVGltZXIpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLmNhbmNlbFRpbWVyKTtcbiAgICAgIHRoaXMuY2FuY2VsVGltZXIgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjbGVhclJlcXVlc3RUaW1lcigpIHtcbiAgICBpZiAodGhpcy5yZXF1ZXN0VGltZXIpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnJlcXVlc3RUaW1lcik7XG4gICAgICB0aGlzLnJlcXVlc3RUaW1lciA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHRyYW5zaXRpb25UbyhuZXdTdGF0ZTogU3RhdGUpIHtcbiAgICBpZiAodGhpcy5zdGF0ZSA9PT0gbmV3U3RhdGUpIHtcbiAgICAgIHRoaXMuZGVidWcubG9nKCdTdGF0ZSBpcyBhbHJlYWR5ICcgKyBuZXdTdGF0ZS5uYW1lKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zdGF0ZSAmJiB0aGlzLnN0YXRlLmV4aXQpIHtcbiAgICAgIHRoaXMuc3RhdGUuZXhpdC5jYWxsKHRoaXMsIG5ld1N0YXRlKTtcbiAgICB9XG5cbiAgICB0aGlzLmRlYnVnLmxvZygnU3RhdGUgY2hhbmdlOiAnICsgKHRoaXMuc3RhdGUgPyB0aGlzLnN0YXRlLm5hbWUgOiAndW5kZWZpbmVkJykgKyAnIC0+ICcgKyBuZXdTdGF0ZS5uYW1lKTtcbiAgICB0aGlzLnN0YXRlID0gbmV3U3RhdGU7XG5cbiAgICBpZiAodGhpcy5zdGF0ZS5lbnRlcikge1xuICAgICAgdGhpcy5zdGF0ZS5lbnRlci5hcHBseSh0aGlzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGdldEV2ZW50SGFuZGxlcjxUIGV4dGVuZHMga2V5b2YgU3RhdGVbJ2V2ZW50cyddPihldmVudE5hbWU6IFQpOiBOb25OdWxsYWJsZTxTdGF0ZVsnZXZlbnRzJ11bVF0+IHtcbiAgICBjb25zdCBoYW5kbGVyID0gdGhpcy5zdGF0ZS5ldmVudHNbZXZlbnROYW1lXTtcblxuICAgIGlmICghaGFuZGxlcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBldmVudCAnJHtldmVudE5hbWV9JyBpbiBzdGF0ZSAnJHt0aGlzLnN0YXRlLm5hbWV9J2ApO1xuICAgIH1cblxuICAgIHJldHVybiBoYW5kbGVyITtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZGlzcGF0Y2hFdmVudDxUIGV4dGVuZHMga2V5b2YgU3RhdGVbJ2V2ZW50cyddPihldmVudE5hbWU6IFQsIC4uLmFyZ3M6IFBhcmFtZXRlcnM8Tm9uTnVsbGFibGU8U3RhdGVbJ2V2ZW50cyddW1RdPj4pIHtcbiAgICBjb25zdCBoYW5kbGVyID0gdGhpcy5zdGF0ZS5ldmVudHNbZXZlbnROYW1lXSBhcyAoKHRoaXM6IENvbm5lY3Rpb24sIC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkKSB8IHVuZGVmaW5lZDtcbiAgICBpZiAoaGFuZGxlcikge1xuICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIG5ldyBFcnJvcihgTm8gZXZlbnQgJyR7ZXZlbnROYW1lfScgaW4gc3RhdGUgJyR7dGhpcy5zdGF0ZS5uYW1lfSdgKSk7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB3cmFwU29ja2V0RXJyb3IoZXJyb3I6IEVycm9yKTogQ29ubmVjdGlvbkVycm9yIHtcbiAgICBpZiAodGhpcy5zdGF0ZSA9PT0gdGhpcy5TVEFURS5DT05ORUNUSU5HIHx8IHRoaXMuc3RhdGUgPT09IHRoaXMuU1RBVEUuU0VOVF9UTFNTU0xORUdPVElBVElPTikge1xuICAgICAgY29uc3QgaG9zdFBvc3RmaXggPSB0aGlzLmNvbmZpZy5vcHRpb25zLnBvcnQgPyBgOiR7dGhpcy5jb25maWcub3B0aW9ucy5wb3J0fWAgOiBgXFxcXCR7dGhpcy5jb25maWcub3B0aW9ucy5pbnN0YW5jZU5hbWV9YDtcbiAgICAgIC8vIElmIHdlIGhhdmUgcm91dGluZyBkYXRhIHN0b3JlZCwgdGhpcyBjb25uZWN0aW9uIGhhcyBiZWVuIHJlZGlyZWN0ZWRcbiAgICAgIGNvbnN0IHNlcnZlciA9IHRoaXMucm91dGluZ0RhdGEgPyB0aGlzLnJvdXRpbmdEYXRhLnNlcnZlciA6IHRoaXMuY29uZmlnLnNlcnZlcjtcbiAgICAgIGNvbnN0IHBvcnQgPSB0aGlzLnJvdXRpbmdEYXRhID8gYDoke3RoaXMucm91dGluZ0RhdGEucG9ydH1gIDogaG9zdFBvc3RmaXg7XG4gICAgICAvLyBHcmFiIHRoZSB0YXJnZXQgaG9zdCBmcm9tIHRoZSBjb25uZWN0aW9uIGNvbmZpZ3VyYXRpb24sIGFuZCBmcm9tIGEgcmVkaXJlY3QgbWVzc2FnZVxuICAgICAgLy8gb3RoZXJ3aXNlLCBsZWF2ZSB0aGUgbWVzc2FnZSBlbXB0eS5cbiAgICAgIGNvbnN0IHJvdXRpbmdNZXNzYWdlID0gdGhpcy5yb3V0aW5nRGF0YSA/IGAgKHJlZGlyZWN0ZWQgZnJvbSAke3RoaXMuY29uZmlnLnNlcnZlcn0ke2hvc3RQb3N0Zml4fSlgIDogJyc7XG4gICAgICBjb25zdCBtZXNzYWdlID0gYEZhaWxlZCB0byBjb25uZWN0IHRvICR7c2VydmVyfSR7cG9ydH0ke3JvdXRpbmdNZXNzYWdlfSAtICR7ZXJyb3IubWVzc2FnZX1gO1xuXG4gICAgICByZXR1cm4gbmV3IENvbm5lY3Rpb25FcnJvcihtZXNzYWdlLCAnRVNPQ0tFVCcsIHsgY2F1c2U6IGVycm9yIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gYENvbm5lY3Rpb24gbG9zdCAtICR7ZXJyb3IubWVzc2FnZX1gO1xuICAgICAgcmV0dXJuIG5ldyBDb25uZWN0aW9uRXJyb3IobWVzc2FnZSwgJ0VTT0NLRVQnLCB7IGNhdXNlOiBlcnJvciB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNvY2tldEVuZCgpIHtcbiAgICB0aGlzLmRlYnVnLmxvZygnc29ja2V0IGVuZGVkJyk7XG4gICAgaWYgKHRoaXMuc3RhdGUgIT09IHRoaXMuU1RBVEUuRklOQUwpIHtcbiAgICAgIGNvbnN0IGVycm9yOiBFcnJvcldpdGhDb2RlID0gbmV3IEVycm9yKCdzb2NrZXQgaGFuZyB1cCcpO1xuICAgICAgZXJyb3IuY29kZSA9ICdFQ09OTlJFU0VUJztcblxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdzb2NrZXRFcnJvcicsIGVycm9yKTtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge1xuICAgICAgICB0aGlzLmVtaXQoJ2Vycm9yJywgdGhpcy53cmFwU29ja2V0RXJyb3IoZXJyb3IpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc29ja2V0Q2xvc2UoKSB7XG4gICAgdGhpcy5kZWJ1Zy5sb2coJ2Nvbm5lY3Rpb24gdG8gJyArIHRoaXMuY29uZmlnLnNlcnZlciArICc6JyArIHRoaXMuY29uZmlnLm9wdGlvbnMucG9ydCArICcgY2xvc2VkJyk7XG4gICAgdGhpcy50cmFuc2l0aW9uVG8odGhpcy5TVEFURS5GSU5BTCk7XG4gICAgdGhpcy5jbGVhbnVwQ29ubmVjdGlvbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZW5kUHJlTG9naW4oKSB7XG4gICAgY29uc3QgWywgbWFqb3IsIG1pbm9yLCBidWlsZF0gPSAvXihcXGQrKVxcLihcXGQrKVxcLihcXGQrKS8uZXhlYyh2ZXJzaW9uKSA/PyBbJzAuMC4wJywgJzAnLCAnMCcsICcwJ107XG4gICAgY29uc3QgcGF5bG9hZCA9IG5ldyBQcmVsb2dpblBheWxvYWQoe1xuICAgICAgLy8gSWYgZW5jcnlwdCBzZXR0aW5nIGlzIHNldCB0byAnc3RyaWN0JywgdGhlbiB3ZSBzaG91bGQgaGF2ZSBhbHJlYWR5IGRvbmUgdGhlIGVuY3J5cHRpb24gYmVmb3JlIGNhbGxpbmdcbiAgICAgIC8vIHRoaXMgZnVuY3Rpb24uIFRoZXJlZm9yZSwgdGhlIGVuY3J5cHQgd2lsbCBiZSBzZXQgdG8gZmFsc2UgaGVyZS5cbiAgICAgIC8vIE90aGVyd2lzZSwgd2Ugd2lsbCBzZXQgZW5jcnlwdCBoZXJlIGJhc2VkIG9uIHRoZSBlbmNyeXB0IEJvb2xlYW4gdmFsdWUgZnJvbSB0aGUgY29uZmlndXJhdGlvbi5cbiAgICAgIGVuY3J5cHQ6IHR5cGVvZiB0aGlzLmNvbmZpZy5vcHRpb25zLmVuY3J5cHQgPT09ICdib29sZWFuJyAmJiB0aGlzLmNvbmZpZy5vcHRpb25zLmVuY3J5cHQsXG4gICAgICB2ZXJzaW9uOiB7IG1ham9yOiBOdW1iZXIobWFqb3IpLCBtaW5vcjogTnVtYmVyKG1pbm9yKSwgYnVpbGQ6IE51bWJlcihidWlsZCksIHN1YmJ1aWxkOiAwIH1cbiAgICB9KTtcblxuICAgIHRoaXMubWVzc2FnZUlvLnNlbmRNZXNzYWdlKFRZUEUuUFJFTE9HSU4sIHBheWxvYWQuZGF0YSk7XG4gICAgdGhpcy5kZWJ1Zy5wYXlsb2FkKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHBheWxvYWQudG9TdHJpbmcoJyAgJyk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNlbmRMb2dpbjdQYWNrZXQoKSB7XG4gICAgY29uc3QgcGF5bG9hZCA9IG5ldyBMb2dpbjdQYXlsb2FkKHtcbiAgICAgIHRkc1ZlcnNpb246IHZlcnNpb25zW3RoaXMuY29uZmlnLm9wdGlvbnMudGRzVmVyc2lvbl0sXG4gICAgICBwYWNrZXRTaXplOiB0aGlzLmNvbmZpZy5vcHRpb25zLnBhY2tldFNpemUsXG4gICAgICBjbGllbnRQcm9nVmVyOiAwLFxuICAgICAgY2xpZW50UGlkOiBwcm9jZXNzLnBpZCxcbiAgICAgIGNvbm5lY3Rpb25JZDogMCxcbiAgICAgIGNsaWVudFRpbWVab25lOiBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KCksXG4gICAgICBjbGllbnRMY2lkOiAweDAwMDAwNDA5XG4gICAgfSk7XG5cbiAgICBjb25zdCB7IGF1dGhlbnRpY2F0aW9uIH0gPSB0aGlzLmNvbmZpZztcbiAgICBzd2l0Y2ggKGF1dGhlbnRpY2F0aW9uLnR5cGUpIHtcbiAgICAgIGNhc2UgJ2F6dXJlLWFjdGl2ZS1kaXJlY3RvcnktcGFzc3dvcmQnOlxuICAgICAgICBwYXlsb2FkLmZlZEF1dGggPSB7XG4gICAgICAgICAgdHlwZTogJ0FEQUwnLFxuICAgICAgICAgIGVjaG86IHRoaXMuZmVkQXV0aFJlcXVpcmVkLFxuICAgICAgICAgIHdvcmtmbG93OiAnZGVmYXVsdCdcbiAgICAgICAgfTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2F6dXJlLWFjdGl2ZS1kaXJlY3RvcnktYWNjZXNzLXRva2VuJzpcbiAgICAgICAgcGF5bG9hZC5mZWRBdXRoID0ge1xuICAgICAgICAgIHR5cGU6ICdTRUNVUklUWVRPS0VOJyxcbiAgICAgICAgICBlY2hvOiB0aGlzLmZlZEF1dGhSZXF1aXJlZCxcbiAgICAgICAgICBmZWRBdXRoVG9rZW46IGF1dGhlbnRpY2F0aW9uLm9wdGlvbnMudG9rZW5cbiAgICAgICAgfTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3Rva2VuLWNyZWRlbnRpYWwnOlxuICAgICAgY2FzZSAnYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1tc2ktdm0nOlxuICAgICAgY2FzZSAnYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1kZWZhdWx0JzpcbiAgICAgIGNhc2UgJ2F6dXJlLWFjdGl2ZS1kaXJlY3RvcnktbXNpLWFwcC1zZXJ2aWNlJzpcbiAgICAgIGNhc2UgJ2F6dXJlLWFjdGl2ZS1kaXJlY3Rvcnktc2VydmljZS1wcmluY2lwYWwtc2VjcmV0JzpcbiAgICAgICAgcGF5bG9hZC5mZWRBdXRoID0ge1xuICAgICAgICAgIHR5cGU6ICdBREFMJyxcbiAgICAgICAgICBlY2hvOiB0aGlzLmZlZEF1dGhSZXF1aXJlZCxcbiAgICAgICAgICB3b3JrZmxvdzogJ2ludGVncmF0ZWQnXG4gICAgICAgIH07XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdudGxtJzpcbiAgICAgICAgcGF5bG9hZC5zc3BpID0gY3JlYXRlTlRMTVJlcXVlc3QoeyBkb21haW46IGF1dGhlbnRpY2F0aW9uLm9wdGlvbnMuZG9tYWluIH0pO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcGF5bG9hZC51c2VyTmFtZSA9IGF1dGhlbnRpY2F0aW9uLm9wdGlvbnMudXNlck5hbWU7XG4gICAgICAgIHBheWxvYWQucGFzc3dvcmQgPSBhdXRoZW50aWNhdGlvbi5vcHRpb25zLnBhc3N3b3JkO1xuICAgIH1cblxuICAgIHBheWxvYWQuaG9zdG5hbWUgPSB0aGlzLmNvbmZpZy5vcHRpb25zLndvcmtzdGF0aW9uSWQgfHwgb3MuaG9zdG5hbWUoKTtcbiAgICBwYXlsb2FkLnNlcnZlck5hbWUgPSB0aGlzLnJvdXRpbmdEYXRhID9cbiAgICAgIGAke3RoaXMucm91dGluZ0RhdGEuc2VydmVyfSR7dGhpcy5yb3V0aW5nRGF0YS5pbnN0YW5jZSA/ICdcXFxcJyArIHRoaXMucm91dGluZ0RhdGEuaW5zdGFuY2UgOiAnJ31gIDpcbiAgICAgIHRoaXMuY29uZmlnLnNlcnZlcjtcbiAgICBwYXlsb2FkLmFwcE5hbWUgPSB0aGlzLmNvbmZpZy5vcHRpb25zLmFwcE5hbWUgfHwgJ1RlZGlvdXMnO1xuICAgIHBheWxvYWQubGlicmFyeU5hbWUgPSBsaWJyYXJ5TmFtZTtcbiAgICBwYXlsb2FkLmxhbmd1YWdlID0gdGhpcy5jb25maWcub3B0aW9ucy5sYW5ndWFnZTtcbiAgICBwYXlsb2FkLmRhdGFiYXNlID0gdGhpcy5jb25maWcub3B0aW9ucy5kYXRhYmFzZTtcbiAgICBwYXlsb2FkLmNsaWVudElkID0gQnVmZmVyLmZyb20oWzEsIDIsIDMsIDQsIDUsIDZdKTtcblxuICAgIHBheWxvYWQucmVhZE9ubHlJbnRlbnQgPSB0aGlzLmNvbmZpZy5vcHRpb25zLnJlYWRPbmx5SW50ZW50O1xuICAgIHBheWxvYWQuaW5pdERiRmF0YWwgPSAhdGhpcy5jb25maWcub3B0aW9ucy5mYWxsYmFja1RvRGVmYXVsdERiO1xuXG4gICAgdGhpcy5yb3V0aW5nRGF0YSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLm1lc3NhZ2VJby5zZW5kTWVzc2FnZShUWVBFLkxPR0lONywgcGF5bG9hZC50b0J1ZmZlcigpKTtcblxuICAgIHRoaXMuZGVidWcucGF5bG9hZChmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBwYXlsb2FkLnRvU3RyaW5nKCcgICcpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZW5kRmVkQXV0aFRva2VuTWVzc2FnZSh0b2tlbjogc3RyaW5nKSB7XG4gICAgY29uc3QgYWNjZXNzVG9rZW5MZW4gPSBCdWZmZXIuYnl0ZUxlbmd0aCh0b2tlbiwgJ3VjczInKTtcbiAgICBjb25zdCBkYXRhID0gQnVmZmVyLmFsbG9jKDggKyBhY2Nlc3NUb2tlbkxlbik7XG4gICAgbGV0IG9mZnNldCA9IDA7XG4gICAgb2Zmc2V0ID0gZGF0YS53cml0ZVVJbnQzMkxFKGFjY2Vzc1Rva2VuTGVuICsgNCwgb2Zmc2V0KTtcbiAgICBvZmZzZXQgPSBkYXRhLndyaXRlVUludDMyTEUoYWNjZXNzVG9rZW5MZW4sIG9mZnNldCk7XG4gICAgZGF0YS53cml0ZSh0b2tlbiwgb2Zmc2V0LCAndWNzMicpO1xuICAgIHRoaXMubWVzc2FnZUlvLnNlbmRNZXNzYWdlKFRZUEUuRkVEQVVUSF9UT0tFTiwgZGF0YSk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNlbmRJbml0aWFsU3FsKCkge1xuICAgIGNvbnN0IHBheWxvYWQgPSBuZXcgU3FsQmF0Y2hQYXlsb2FkKHRoaXMuZ2V0SW5pdGlhbFNxbCgpLCB0aGlzLmN1cnJlbnRUcmFuc2FjdGlvbkRlc2NyaXB0b3IoKSwgdGhpcy5jb25maWcub3B0aW9ucyk7XG5cbiAgICBjb25zdCBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoeyB0eXBlOiBUWVBFLlNRTF9CQVRDSCB9KTtcbiAgICB0aGlzLm1lc3NhZ2VJby5vdXRnb2luZ01lc3NhZ2VTdHJlYW0ud3JpdGUobWVzc2FnZSk7XG4gICAgUmVhZGFibGUuZnJvbShwYXlsb2FkKS5waXBlKG1lc3NhZ2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXRJbml0aWFsU3FsKCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBbXTtcblxuICAgIGlmICh0aGlzLmNvbmZpZy5vcHRpb25zLmVuYWJsZUFuc2lOdWxsID09PSB0cnVlKSB7XG4gICAgICBvcHRpb25zLnB1c2goJ3NldCBhbnNpX251bGxzIG9uJyk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmNvbmZpZy5vcHRpb25zLmVuYWJsZUFuc2lOdWxsID09PSBmYWxzZSkge1xuICAgICAgb3B0aW9ucy5wdXNoKCdzZXQgYW5zaV9udWxscyBvZmYnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb25maWcub3B0aW9ucy5lbmFibGVBbnNpTnVsbERlZmF1bHQgPT09IHRydWUpIHtcbiAgICAgIG9wdGlvbnMucHVzaCgnc2V0IGFuc2lfbnVsbF9kZmx0X29uIG9uJyk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmNvbmZpZy5vcHRpb25zLmVuYWJsZUFuc2lOdWxsRGVmYXVsdCA9PT0gZmFsc2UpIHtcbiAgICAgIG9wdGlvbnMucHVzaCgnc2V0IGFuc2lfbnVsbF9kZmx0X29uIG9mZicpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbmZpZy5vcHRpb25zLmVuYWJsZUFuc2lQYWRkaW5nID09PSB0cnVlKSB7XG4gICAgICBvcHRpb25zLnB1c2goJ3NldCBhbnNpX3BhZGRpbmcgb24nKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuY29uZmlnLm9wdGlvbnMuZW5hYmxlQW5zaVBhZGRpbmcgPT09IGZhbHNlKSB7XG4gICAgICBvcHRpb25zLnB1c2goJ3NldCBhbnNpX3BhZGRpbmcgb2ZmJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29uZmlnLm9wdGlvbnMuZW5hYmxlQW5zaVdhcm5pbmdzID09PSB0cnVlKSB7XG4gICAgICBvcHRpb25zLnB1c2goJ3NldCBhbnNpX3dhcm5pbmdzIG9uJyk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmNvbmZpZy5vcHRpb25zLmVuYWJsZUFuc2lXYXJuaW5ncyA9PT0gZmFsc2UpIHtcbiAgICAgIG9wdGlvbnMucHVzaCgnc2V0IGFuc2lfd2FybmluZ3Mgb2ZmJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29uZmlnLm9wdGlvbnMuZW5hYmxlQXJpdGhBYm9ydCA9PT0gdHJ1ZSkge1xuICAgICAgb3B0aW9ucy5wdXNoKCdzZXQgYXJpdGhhYm9ydCBvbicpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5jb25maWcub3B0aW9ucy5lbmFibGVBcml0aEFib3J0ID09PSBmYWxzZSkge1xuICAgICAgb3B0aW9ucy5wdXNoKCdzZXQgYXJpdGhhYm9ydCBvZmYnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb25maWcub3B0aW9ucy5lbmFibGVDb25jYXROdWxsWWllbGRzTnVsbCA9PT0gdHJ1ZSkge1xuICAgICAgb3B0aW9ucy5wdXNoKCdzZXQgY29uY2F0X251bGxfeWllbGRzX251bGwgb24nKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuY29uZmlnLm9wdGlvbnMuZW5hYmxlQ29uY2F0TnVsbFlpZWxkc051bGwgPT09IGZhbHNlKSB7XG4gICAgICBvcHRpb25zLnB1c2goJ3NldCBjb25jYXRfbnVsbF95aWVsZHNfbnVsbCBvZmYnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb25maWcub3B0aW9ucy5lbmFibGVDdXJzb3JDbG9zZU9uQ29tbWl0ID09PSB0cnVlKSB7XG4gICAgICBvcHRpb25zLnB1c2goJ3NldCBjdXJzb3JfY2xvc2Vfb25fY29tbWl0IG9uJyk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmNvbmZpZy5vcHRpb25zLmVuYWJsZUN1cnNvckNsb3NlT25Db21taXQgPT09IGZhbHNlKSB7XG4gICAgICBvcHRpb25zLnB1c2goJ3NldCBjdXJzb3JfY2xvc2Vfb25fY29tbWl0IG9mZicpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbmZpZy5vcHRpb25zLmRhdGVmaXJzdCAhPT0gbnVsbCkge1xuICAgICAgb3B0aW9ucy5wdXNoKGBzZXQgZGF0ZWZpcnN0ICR7dGhpcy5jb25maWcub3B0aW9ucy5kYXRlZmlyc3R9YCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29uZmlnLm9wdGlvbnMuZGF0ZUZvcm1hdCAhPT0gbnVsbCkge1xuICAgICAgb3B0aW9ucy5wdXNoKGBzZXQgZGF0ZWZvcm1hdCAke3RoaXMuY29uZmlnLm9wdGlvbnMuZGF0ZUZvcm1hdH1gKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb25maWcub3B0aW9ucy5lbmFibGVJbXBsaWNpdFRyYW5zYWN0aW9ucyA9PT0gdHJ1ZSkge1xuICAgICAgb3B0aW9ucy5wdXNoKCdzZXQgaW1wbGljaXRfdHJhbnNhY3Rpb25zIG9uJyk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmNvbmZpZy5vcHRpb25zLmVuYWJsZUltcGxpY2l0VHJhbnNhY3Rpb25zID09PSBmYWxzZSkge1xuICAgICAgb3B0aW9ucy5wdXNoKCdzZXQgaW1wbGljaXRfdHJhbnNhY3Rpb25zIG9mZicpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbmZpZy5vcHRpb25zLmxhbmd1YWdlICE9PSBudWxsKSB7XG4gICAgICBvcHRpb25zLnB1c2goYHNldCBsYW5ndWFnZSAke3RoaXMuY29uZmlnLm9wdGlvbnMubGFuZ3VhZ2V9YCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29uZmlnLm9wdGlvbnMuZW5hYmxlTnVtZXJpY1JvdW5kYWJvcnQgPT09IHRydWUpIHtcbiAgICAgIG9wdGlvbnMucHVzaCgnc2V0IG51bWVyaWNfcm91bmRhYm9ydCBvbicpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5jb25maWcub3B0aW9ucy5lbmFibGVOdW1lcmljUm91bmRhYm9ydCA9PT0gZmFsc2UpIHtcbiAgICAgIG9wdGlvbnMucHVzaCgnc2V0IG51bWVyaWNfcm91bmRhYm9ydCBvZmYnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb25maWcub3B0aW9ucy5lbmFibGVRdW90ZWRJZGVudGlmaWVyID09PSB0cnVlKSB7XG4gICAgICBvcHRpb25zLnB1c2goJ3NldCBxdW90ZWRfaWRlbnRpZmllciBvbicpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5jb25maWcub3B0aW9ucy5lbmFibGVRdW90ZWRJZGVudGlmaWVyID09PSBmYWxzZSkge1xuICAgICAgb3B0aW9ucy5wdXNoKCdzZXQgcXVvdGVkX2lkZW50aWZpZXIgb2ZmJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29uZmlnLm9wdGlvbnMudGV4dHNpemUgIT09IG51bGwpIHtcbiAgICAgIG9wdGlvbnMucHVzaChgc2V0IHRleHRzaXplICR7dGhpcy5jb25maWcub3B0aW9ucy50ZXh0c2l6ZX1gKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb25maWcub3B0aW9ucy5jb25uZWN0aW9uSXNvbGF0aW9uTGV2ZWwgIT09IG51bGwpIHtcbiAgICAgIG9wdGlvbnMucHVzaChgc2V0IHRyYW5zYWN0aW9uIGlzb2xhdGlvbiBsZXZlbCAke3RoaXMuZ2V0SXNvbGF0aW9uTGV2ZWxUZXh0KHRoaXMuY29uZmlnLm9wdGlvbnMuY29ubmVjdGlvbklzb2xhdGlvbkxldmVsKX1gKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb25maWcub3B0aW9ucy5hYm9ydFRyYW5zYWN0aW9uT25FcnJvciA9PT0gdHJ1ZSkge1xuICAgICAgb3B0aW9ucy5wdXNoKCdzZXQgeGFjdF9hYm9ydCBvbicpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5jb25maWcub3B0aW9ucy5hYm9ydFRyYW5zYWN0aW9uT25FcnJvciA9PT0gZmFsc2UpIHtcbiAgICAgIG9wdGlvbnMucHVzaCgnc2V0IHhhY3RfYWJvcnQgb2ZmJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdGlvbnMuam9pbignXFxuJyk7XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZSB0aGUgU1FMIGJhdGNoIHJlcHJlc2VudGVkIGJ5IFtbUmVxdWVzdF1dLlxuICAgKiBUaGVyZSBpcyBubyBwYXJhbSBzdXBwb3J0LCBhbmQgdW5saWtlIFtbUmVxdWVzdC5leGVjU3FsXV0sXG4gICAqIGl0IGlzIG5vdCBsaWtlbHkgdGhhdCBTUUwgU2VydmVyIHdpbGwgcmV1c2UgdGhlIGV4ZWN1dGlvbiBwbGFuIGl0IGdlbmVyYXRlcyBmb3IgdGhlIFNRTC5cbiAgICpcbiAgICogSW4gYWxtb3N0IGFsbCBjYXNlcywgW1tSZXF1ZXN0LmV4ZWNTcWxdXSB3aWxsIGJlIGEgYmV0dGVyIGNob2ljZS5cbiAgICpcbiAgICogQHBhcmFtIHJlcXVlc3QgQSBbW1JlcXVlc3RdXSBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSByZXF1ZXN0LlxuICAgKi9cbiAgZXhlY1NxbEJhdGNoKHJlcXVlc3Q6IFJlcXVlc3QpIHtcbiAgICB0aGlzLm1ha2VSZXF1ZXN0KHJlcXVlc3QsIFRZUEUuU1FMX0JBVENILCBuZXcgU3FsQmF0Y2hQYXlsb2FkKHJlcXVlc3Quc3FsVGV4dE9yUHJvY2VkdXJlISwgdGhpcy5jdXJyZW50VHJhbnNhY3Rpb25EZXNjcmlwdG9yKCksIHRoaXMuY29uZmlnLm9wdGlvbnMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgRXhlY3V0ZSB0aGUgU1FMIHJlcHJlc2VudGVkIGJ5IFtbUmVxdWVzdF1dLlxuICAgKlxuICAgKiBBcyBgc3BfZXhlY3V0ZXNxbGAgaXMgdXNlZCB0byBleGVjdXRlIHRoZSBTUUwsIGlmIHRoZSBzYW1lIFNRTCBpcyBleGVjdXRlZCBtdWx0aXBsZXMgdGltZXNcbiAgICogdXNpbmcgdGhpcyBmdW5jdGlvbiwgdGhlIFNRTCBTZXJ2ZXIgcXVlcnkgb3B0aW1pemVyIGlzIGxpa2VseSB0byByZXVzZSB0aGUgZXhlY3V0aW9uIHBsYW4gaXQgZ2VuZXJhdGVzXG4gICAqIGZvciB0aGUgZmlyc3QgZXhlY3V0aW9uLiBUaGlzIG1heSBhbHNvIHJlc3VsdCBpbiBTUUwgc2VydmVyIHRyZWF0aW5nIHRoZSByZXF1ZXN0IGxpa2UgYSBzdG9yZWQgcHJvY2VkdXJlXG4gICAqIHdoaWNoIGNhbiByZXN1bHQgaW4gdGhlIFtbRXZlbnRfZG9uZUluUHJvY11dIG9yIFtbRXZlbnRfZG9uZVByb2NdXSBldmVudHMgYmVpbmcgZW1pdHRlZCBpbnN0ZWFkIG9mIHRoZVxuICAgKiBbW0V2ZW50X2RvbmVdXSBldmVudCB5b3UgbWlnaHQgZXhwZWN0LiBVc2luZyBbW2V4ZWNTcWxCYXRjaF1dIHdpbGwgcHJldmVudCB0aGlzIGZyb20gb2NjdXJyaW5nIGJ1dCBtYXkgaGF2ZSBhIG5lZ2F0aXZlIHBlcmZvcm1hbmNlIGltcGFjdC5cbiAgICpcbiAgICogQmV3YXJlIG9mIHRoZSB3YXkgdGhhdCBzY29waW5nIHJ1bGVzIGFwcGx5LCBhbmQgaG93IHRoZXkgbWF5IFthZmZlY3QgbG9jYWwgdGVtcCB0YWJsZXNdKGh0dHA6Ly93ZWJsb2dzLnNxbHRlYW0uY29tL21sYWRlbnAvYXJjaGl2ZS8yMDA2LzExLzAzLzE3MTk3LmFzcHgpXG4gICAqIElmIHlvdSdyZSBydW5uaW5nIGluIHRvIHNjb3BpbmcgaXNzdWVzLCB0aGVuIFtbZXhlY1NxbEJhdGNoXV0gbWF5IGJlIGEgYmV0dGVyIGNob2ljZS5cbiAgICogU2VlIGFsc28gW2lzc3VlICMyNF0oaHR0cHM6Ly9naXRodWIuY29tL3Bla2ltL3RlZGlvdXMvaXNzdWVzLzI0KVxuICAgKlxuICAgKiBAcGFyYW0gcmVxdWVzdCBBIFtbUmVxdWVzdF1dIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIHJlcXVlc3QuXG4gICAqL1xuICBleGVjU3FsKHJlcXVlc3Q6IFJlcXVlc3QpIHtcbiAgICB0cnkge1xuICAgICAgcmVxdWVzdC52YWxpZGF0ZVBhcmFtZXRlcnModGhpcy5kYXRhYmFzZUNvbGxhdGlvbik7XG4gICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgICAgcmVxdWVzdC5lcnJvciA9IGVycm9yO1xuXG4gICAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgdGhpcy5kZWJ1Zy5sb2coZXJyb3IubWVzc2FnZSk7XG4gICAgICAgIHJlcXVlc3QuY2FsbGJhY2soZXJyb3IpO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwYXJhbWV0ZXJzOiBQYXJhbWV0ZXJbXSA9IFtdO1xuXG4gICAgcGFyYW1ldGVycy5wdXNoKHtcbiAgICAgIHR5cGU6IFRZUEVTLk5WYXJDaGFyLFxuICAgICAgbmFtZTogJ3N0YXRlbWVudCcsXG4gICAgICB2YWx1ZTogcmVxdWVzdC5zcWxUZXh0T3JQcm9jZWR1cmUsXG4gICAgICBvdXRwdXQ6IGZhbHNlLFxuICAgICAgbGVuZ3RoOiB1bmRlZmluZWQsXG4gICAgICBwcmVjaXNpb246IHVuZGVmaW5lZCxcbiAgICAgIHNjYWxlOiB1bmRlZmluZWRcbiAgICB9KTtcblxuICAgIGlmIChyZXF1ZXN0LnBhcmFtZXRlcnMubGVuZ3RoKSB7XG4gICAgICBwYXJhbWV0ZXJzLnB1c2goe1xuICAgICAgICB0eXBlOiBUWVBFUy5OVmFyQ2hhcixcbiAgICAgICAgbmFtZTogJ3BhcmFtcycsXG4gICAgICAgIHZhbHVlOiByZXF1ZXN0Lm1ha2VQYXJhbXNQYXJhbWV0ZXIocmVxdWVzdC5wYXJhbWV0ZXJzKSxcbiAgICAgICAgb3V0cHV0OiBmYWxzZSxcbiAgICAgICAgbGVuZ3RoOiB1bmRlZmluZWQsXG4gICAgICAgIHByZWNpc2lvbjogdW5kZWZpbmVkLFxuICAgICAgICBzY2FsZTogdW5kZWZpbmVkXG4gICAgICB9KTtcblxuICAgICAgcGFyYW1ldGVycy5wdXNoKC4uLnJlcXVlc3QucGFyYW1ldGVycyk7XG4gICAgfVxuXG4gICAgdGhpcy5tYWtlUmVxdWVzdChyZXF1ZXN0LCBUWVBFLlJQQ19SRVFVRVNULCBuZXcgUnBjUmVxdWVzdFBheWxvYWQoUHJvY2VkdXJlcy5TcF9FeGVjdXRlU3FsLCBwYXJhbWV0ZXJzLCB0aGlzLmN1cnJlbnRUcmFuc2FjdGlvbkRlc2NyaXB0b3IoKSwgdGhpcy5jb25maWcub3B0aW9ucywgdGhpcy5kYXRhYmFzZUNvbGxhdGlvbikpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgQnVsa0xvYWQgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBwYXJhbSB0YWJsZSBUaGUgbmFtZSBvZiB0aGUgdGFibGUgdG8gYnVsay1pbnNlcnQgaW50by5cbiAgICogQHBhcmFtIG9wdGlvbnMgQSBzZXQgb2YgYnVsayBsb2FkIG9wdGlvbnMuXG4gICAqL1xuICBuZXdCdWxrTG9hZCh0YWJsZTogc3RyaW5nLCBjYWxsYmFjazogQnVsa0xvYWRDYWxsYmFjayk6IEJ1bGtMb2FkXG4gIG5ld0J1bGtMb2FkKHRhYmxlOiBzdHJpbmcsIG9wdGlvbnM6IEJ1bGtMb2FkT3B0aW9ucywgY2FsbGJhY2s6IEJ1bGtMb2FkQ2FsbGJhY2spOiBCdWxrTG9hZFxuICBuZXdCdWxrTG9hZCh0YWJsZTogc3RyaW5nLCBjYWxsYmFja09yT3B0aW9uczogQnVsa0xvYWRPcHRpb25zIHwgQnVsa0xvYWRDYWxsYmFjaywgY2FsbGJhY2s/OiBCdWxrTG9hZENhbGxiYWNrKSB7XG4gICAgbGV0IG9wdGlvbnM6IEJ1bGtMb2FkT3B0aW9ucztcblxuICAgIGlmIChjYWxsYmFjayA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjYWxsYmFjayA9IGNhbGxiYWNrT3JPcHRpb25zIGFzIEJ1bGtMb2FkQ2FsbGJhY2s7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbnMgPSBjYWxsYmFja09yT3B0aW9ucyBhcyBCdWxrTG9hZE9wdGlvbnM7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSAnb2JqZWN0Jykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJvcHRpb25zXCIgYXJndW1lbnQgbXVzdCBiZSBhbiBvYmplY3QnKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBCdWxrTG9hZCh0YWJsZSwgdGhpcy5kYXRhYmFzZUNvbGxhdGlvbiwgdGhpcy5jb25maWcub3B0aW9ucywgb3B0aW9ucywgY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgYSBbW0J1bGtMb2FkXV0uXG4gICAqXG4gICAqIGBgYGpzXG4gICAqIC8vIFdlIHdhbnQgdG8gcGVyZm9ybSBhIGJ1bGsgbG9hZCBpbnRvIGEgdGFibGUgd2l0aCB0aGUgZm9sbG93aW5nIGZvcm1hdDpcbiAgICogLy8gQ1JFQVRFIFRBQkxFIGVtcGxveWVlcyAoZmlyc3RfbmFtZSBudmFyY2hhcigyNTUpLCBsYXN0X25hbWUgbnZhcmNoYXIoMjU1KSwgZGF5X29mX2JpcnRoIGRhdGUpO1xuICAgKlxuICAgKiBjb25zdCBidWxrTG9hZCA9IGNvbm5lY3Rpb24ubmV3QnVsa0xvYWQoJ2VtcGxveWVlcycsIChlcnIsIHJvd0NvdW50KSA9PiB7XG4gICAqICAgLy8gLi4uXG4gICAqIH0pO1xuICAgKlxuICAgKiAvLyBGaXJzdCwgd2UgbmVlZCB0byBzcGVjaWZ5IHRoZSBjb2x1bW5zIHRoYXQgd2Ugd2FudCB0byB3cml0ZSB0byxcbiAgICogLy8gYW5kIHRoZWlyIGRlZmluaXRpb25zLiBUaGVzZSBkZWZpbml0aW9ucyBtdXN0IG1hdGNoIHRoZSBhY3R1YWwgdGFibGUsXG4gICAqIC8vIG90aGVyd2lzZSB0aGUgYnVsayBsb2FkIHdpbGwgZmFpbC5cbiAgICogYnVsa0xvYWQuYWRkQ29sdW1uKCdmaXJzdF9uYW1lJywgVFlQRVMuTlZhcmNoYXIsIHsgbnVsbGFibGU6IGZhbHNlIH0pO1xuICAgKiBidWxrTG9hZC5hZGRDb2x1bW4oJ2xhc3RfbmFtZScsIFRZUEVTLk5WYXJjaGFyLCB7IG51bGxhYmxlOiBmYWxzZSB9KTtcbiAgICogYnVsa0xvYWQuYWRkQ29sdW1uKCdkYXRlX29mX2JpcnRoJywgVFlQRVMuRGF0ZSwgeyBudWxsYWJsZTogZmFsc2UgfSk7XG4gICAqXG4gICAqIC8vIEV4ZWN1dGUgYSBidWxrIGxvYWQgd2l0aCBhIHByZWRlZmluZWQgbGlzdCBvZiByb3dzLlxuICAgKiAvL1xuICAgKiAvLyBOb3RlIHRoYXQgdGhlc2Ugcm93cyBhcmUgaGVsZCBpbiBtZW1vcnkgdW50aWwgdGhlXG4gICAqIC8vIGJ1bGsgbG9hZCB3YXMgcGVyZm9ybWVkLCBzbyBpZiB5b3UgbmVlZCB0byB3cml0ZSBhIGxhcmdlXG4gICAqIC8vIG51bWJlciBvZiByb3dzIChlLmcuIGJ5IHJlYWRpbmcgZnJvbSBhIENTViBmaWxlKSxcbiAgICogLy8gcGFzc2luZyBhbiBgQXN5bmNJdGVyYWJsZWAgaXMgYWR2aXNhYmxlIHRvIGtlZXAgbWVtb3J5IHVzYWdlIGxvdy5cbiAgICogY29ubmVjdGlvbi5leGVjQnVsa0xvYWQoYnVsa0xvYWQsIFtcbiAgICogICB7ICdmaXJzdF9uYW1lJzogJ1N0ZXZlJywgJ2xhc3RfbmFtZSc6ICdKb2JzJywgJ2RheV9vZl9iaXJ0aCc6IG5ldyBEYXRlKCcwMi0yNC0xOTU1JykgfSxcbiAgICogICB7ICdmaXJzdF9uYW1lJzogJ0JpbGwnLCAnbGFzdF9uYW1lJzogJ0dhdGVzJywgJ2RheV9vZl9iaXJ0aCc6IG5ldyBEYXRlKCcxMC0yOC0xOTU1JykgfVxuICAgKiBdKTtcbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSBidWxrTG9hZCBBIHByZXZpb3VzbHkgY3JlYXRlZCBbW0J1bGtMb2FkXV0uXG4gICAqIEBwYXJhbSByb3dzIEEgW1tJdGVyYWJsZV1dIG9yIFtbQXN5bmNJdGVyYWJsZV1dIHRoYXQgY29udGFpbnMgdGhlIHJvd3MgdGhhdCBzaG91bGQgYmUgYnVsayBsb2FkZWQuXG4gICAqL1xuICBleGVjQnVsa0xvYWQoYnVsa0xvYWQ6IEJ1bGtMb2FkLCByb3dzOiBBc3luY0l0ZXJhYmxlPHVua25vd25bXSB8IHsgW2NvbHVtbk5hbWU6IHN0cmluZ106IHVua25vd24gfT4gfCBJdGVyYWJsZTx1bmtub3duW10gfCB7IFtjb2x1bW5OYW1lOiBzdHJpbmddOiB1bmtub3duIH0+KTogdm9pZFxuXG4gIGV4ZWNCdWxrTG9hZChidWxrTG9hZDogQnVsa0xvYWQsIHJvd3M/OiBBc3luY0l0ZXJhYmxlPHVua25vd25bXSB8IHsgW2NvbHVtbk5hbWU6IHN0cmluZ106IHVua25vd24gfT4gfCBJdGVyYWJsZTx1bmtub3duW10gfCB7IFtjb2x1bW5OYW1lOiBzdHJpbmddOiB1bmtub3duIH0+KSB7XG4gICAgYnVsa0xvYWQuZXhlY3V0aW9uU3RhcnRlZCA9IHRydWU7XG5cbiAgICBpZiAocm93cykge1xuICAgICAgaWYgKGJ1bGtMb2FkLnN0cmVhbWluZ01vZGUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ29ubmVjdGlvbi5leGVjQnVsa0xvYWQgY2FuJ3QgYmUgY2FsbGVkIHdpdGggYSBCdWxrTG9hZCB0aGF0IHdhcyBwdXQgaW4gc3RyZWFtaW5nIG1vZGUuXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoYnVsa0xvYWQuZmlyc3RSb3dXcml0dGVuKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvbm5lY3Rpb24uZXhlY0J1bGtMb2FkIGNhbid0IGJlIGNhbGxlZCB3aXRoIGEgQnVsa0xvYWQgdGhhdCBhbHJlYWR5IGhhcyByb3dzIHdyaXR0ZW4gdG8gaXQuXCIpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByb3dTdHJlYW0gPSBSZWFkYWJsZS5mcm9tKHJvd3MpO1xuXG4gICAgICAvLyBEZXN0cm95IHRoZSBwYWNrZXQgdHJhbnNmb3JtIGlmIGFuIGVycm9yIGhhcHBlbnMgaW4gdGhlIHJvdyBzdHJlYW0sXG4gICAgICAvLyBlLmcuIGlmIGFuIGVycm9yIGlzIHRocm93biBmcm9tIHdpdGhpbiBhIGdlbmVyYXRvciBvciBzdHJlYW0uXG4gICAgICByb3dTdHJlYW0ub24oJ2Vycm9yJywgKGVycikgPT4ge1xuICAgICAgICBidWxrTG9hZC5yb3dUb1BhY2tldFRyYW5zZm9ybS5kZXN0cm95KGVycik7XG4gICAgICB9KTtcblxuICAgICAgLy8gRGVzdHJveSB0aGUgcm93IHN0cmVhbSBpZiBhbiBlcnJvciBoYXBwZW5zIGluIHRoZSBwYWNrZXQgdHJhbnNmb3JtLFxuICAgICAgLy8gZS5nLiBpZiB0aGUgYnVsayBsb2FkIGlzIGNhbmNlbGxlZC5cbiAgICAgIGJ1bGtMb2FkLnJvd1RvUGFja2V0VHJhbnNmb3JtLm9uKCdlcnJvcicsIChlcnIpID0+IHtcbiAgICAgICAgcm93U3RyZWFtLmRlc3Ryb3koZXJyKTtcbiAgICAgIH0pO1xuXG4gICAgICByb3dTdHJlYW0ucGlwZShidWxrTG9hZC5yb3dUb1BhY2tldFRyYW5zZm9ybSk7XG4gICAgfSBlbHNlIGlmICghYnVsa0xvYWQuc3RyZWFtaW5nTW9kZSkge1xuICAgICAgLy8gSWYgdGhlIGJ1bGtsb2FkIHdhcyBub3QgcHV0IGludG8gc3RyZWFtaW5nIG1vZGUgYnkgdGhlIHVzZXIsXG4gICAgICAvLyB3ZSBlbmQgdGhlIHJvd1RvUGFja2V0VHJhbnNmb3JtIGhlcmUgZm9yIHRoZW0uXG4gICAgICAvL1xuICAgICAgLy8gSWYgaXQgd2FzIHB1dCBpbnRvIHN0cmVhbWluZyBtb2RlLCBpdCdzIHRoZSB1c2VyJ3MgcmVzcG9uc2liaWxpdHlcbiAgICAgIC8vIHRvIGVuZCB0aGUgc3RyZWFtLlxuICAgICAgYnVsa0xvYWQucm93VG9QYWNrZXRUcmFuc2Zvcm0uZW5kKCk7XG4gICAgfVxuXG4gICAgY29uc3Qgb25DYW5jZWwgPSAoKSA9PiB7XG4gICAgICByZXF1ZXN0LmNhbmNlbCgpO1xuICAgIH07XG5cbiAgICBjb25zdCBwYXlsb2FkID0gbmV3IEJ1bGtMb2FkUGF5bG9hZChidWxrTG9hZCk7XG5cbiAgICBjb25zdCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoYnVsa0xvYWQuZ2V0QnVsa0luc2VydFNxbCgpLCAoZXJyb3I6IChFcnJvciAmIHsgY29kZT86IHN0cmluZyB9KSB8IG51bGwgfCB1bmRlZmluZWQpID0+IHtcbiAgICAgIGJ1bGtMb2FkLnJlbW92ZUxpc3RlbmVyKCdjYW5jZWwnLCBvbkNhbmNlbCk7XG5cbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBpZiAoZXJyb3IuY29kZSA9PT0gJ1VOS05PV04nKSB7XG4gICAgICAgICAgZXJyb3IubWVzc2FnZSArPSAnIFRoaXMgaXMgbGlrZWx5IGJlY2F1c2UgdGhlIHNjaGVtYSBvZiB0aGUgQnVsa0xvYWQgZG9lcyBub3QgbWF0Y2ggdGhlIHNjaGVtYSBvZiB0aGUgdGFibGUgeW91IGFyZSBhdHRlbXB0aW5nIHRvIGluc2VydCBpbnRvLic7XG4gICAgICAgIH1cbiAgICAgICAgYnVsa0xvYWQuZXJyb3IgPSBlcnJvcjtcbiAgICAgICAgYnVsa0xvYWQuY2FsbGJhY2soZXJyb3IpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMubWFrZVJlcXVlc3QoYnVsa0xvYWQsIFRZUEUuQlVMS19MT0FELCBwYXlsb2FkKTtcbiAgICB9KTtcblxuICAgIGJ1bGtMb2FkLm9uY2UoJ2NhbmNlbCcsIG9uQ2FuY2VsKTtcblxuICAgIHRoaXMuZXhlY1NxbEJhdGNoKHJlcXVlc3QpO1xuICB9XG5cbiAgLyoqXG4gICAqIFByZXBhcmUgdGhlIFNRTCByZXByZXNlbnRlZCBieSB0aGUgcmVxdWVzdC5cbiAgICpcbiAgICogVGhlIHJlcXVlc3QgY2FuIHRoZW4gYmUgdXNlZCBpbiBzdWJzZXF1ZW50IGNhbGxzIHRvXG4gICAqIFtbZXhlY3V0ZV1dIGFuZCBbW3VucHJlcGFyZV1dXG4gICAqXG4gICAqIEBwYXJhbSByZXF1ZXN0IEEgW1tSZXF1ZXN0XV0gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgcmVxdWVzdC5cbiAgICogICBQYXJhbWV0ZXJzIG9ubHkgcmVxdWlyZSBhIG5hbWUgYW5kIHR5cGUuIFBhcmFtZXRlciB2YWx1ZXMgYXJlIGlnbm9yZWQuXG4gICAqL1xuICBwcmVwYXJlKHJlcXVlc3Q6IFJlcXVlc3QpIHtcbiAgICBjb25zdCBwYXJhbWV0ZXJzOiBQYXJhbWV0ZXJbXSA9IFtdO1xuXG4gICAgcGFyYW1ldGVycy5wdXNoKHtcbiAgICAgIHR5cGU6IFRZUEVTLkludCxcbiAgICAgIG5hbWU6ICdoYW5kbGUnLFxuICAgICAgdmFsdWU6IHVuZGVmaW5lZCxcbiAgICAgIG91dHB1dDogdHJ1ZSxcbiAgICAgIGxlbmd0aDogdW5kZWZpbmVkLFxuICAgICAgcHJlY2lzaW9uOiB1bmRlZmluZWQsXG4gICAgICBzY2FsZTogdW5kZWZpbmVkXG4gICAgfSk7XG5cbiAgICBwYXJhbWV0ZXJzLnB1c2goe1xuICAgICAgdHlwZTogVFlQRVMuTlZhckNoYXIsXG4gICAgICBuYW1lOiAncGFyYW1zJyxcbiAgICAgIHZhbHVlOiByZXF1ZXN0LnBhcmFtZXRlcnMubGVuZ3RoID8gcmVxdWVzdC5tYWtlUGFyYW1zUGFyYW1ldGVyKHJlcXVlc3QucGFyYW1ldGVycykgOiBudWxsLFxuICAgICAgb3V0cHV0OiBmYWxzZSxcbiAgICAgIGxlbmd0aDogdW5kZWZpbmVkLFxuICAgICAgcHJlY2lzaW9uOiB1bmRlZmluZWQsXG4gICAgICBzY2FsZTogdW5kZWZpbmVkXG4gICAgfSk7XG5cbiAgICBwYXJhbWV0ZXJzLnB1c2goe1xuICAgICAgdHlwZTogVFlQRVMuTlZhckNoYXIsXG4gICAgICBuYW1lOiAnc3RtdCcsXG4gICAgICB2YWx1ZTogcmVxdWVzdC5zcWxUZXh0T3JQcm9jZWR1cmUsXG4gICAgICBvdXRwdXQ6IGZhbHNlLFxuICAgICAgbGVuZ3RoOiB1bmRlZmluZWQsXG4gICAgICBwcmVjaXNpb246IHVuZGVmaW5lZCxcbiAgICAgIHNjYWxlOiB1bmRlZmluZWRcbiAgICB9KTtcblxuICAgIHJlcXVlc3QucHJlcGFyaW5nID0gdHJ1ZTtcblxuICAgIC8vIFRPRE86IFdlIG5lZWQgdG8gY2xlYW4gdXAgdGhpcyBldmVudCBoYW5kbGVyLCBvdGhlcndpc2UgdGhpcyBsZWFrcyBtZW1vcnlcbiAgICByZXF1ZXN0Lm9uKCdyZXR1cm5WYWx1ZScsIChuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpID0+IHtcbiAgICAgIGlmIChuYW1lID09PSAnaGFuZGxlJykge1xuICAgICAgICByZXF1ZXN0LmhhbmRsZSA9IHZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVxdWVzdC5lcnJvciA9IG5ldyBSZXF1ZXN0RXJyb3IoYFRlZGlvdXMgPiBVbmV4cGVjdGVkIG91dHB1dCBwYXJhbWV0ZXIgJHtuYW1lfSBmcm9tIHNwX3ByZXBhcmVgKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMubWFrZVJlcXVlc3QocmVxdWVzdCwgVFlQRS5SUENfUkVRVUVTVCwgbmV3IFJwY1JlcXVlc3RQYXlsb2FkKFByb2NlZHVyZXMuU3BfUHJlcGFyZSwgcGFyYW1ldGVycywgdGhpcy5jdXJyZW50VHJhbnNhY3Rpb25EZXNjcmlwdG9yKCksIHRoaXMuY29uZmlnLm9wdGlvbnMsIHRoaXMuZGF0YWJhc2VDb2xsYXRpb24pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWxlYXNlIHRoZSBTUUwgU2VydmVyIHJlc291cmNlcyBhc3NvY2lhdGVkIHdpdGggYSBwcmV2aW91c2x5IHByZXBhcmVkIHJlcXVlc3QuXG4gICAqXG4gICAqIEBwYXJhbSByZXF1ZXN0IEEgW1tSZXF1ZXN0XV0gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgcmVxdWVzdC5cbiAgICogICBQYXJhbWV0ZXJzIG9ubHkgcmVxdWlyZSBhIG5hbWUgYW5kIHR5cGUuXG4gICAqICAgUGFyYW1ldGVyIHZhbHVlcyBhcmUgaWdub3JlZC5cbiAgICovXG4gIHVucHJlcGFyZShyZXF1ZXN0OiBSZXF1ZXN0KSB7XG4gICAgY29uc3QgcGFyYW1ldGVyczogUGFyYW1ldGVyW10gPSBbXTtcblxuICAgIHBhcmFtZXRlcnMucHVzaCh7XG4gICAgICB0eXBlOiBUWVBFUy5JbnQsXG4gICAgICBuYW1lOiAnaGFuZGxlJyxcbiAgICAgIC8vIFRPRE86IEFib3J0IGlmIGByZXF1ZXN0LmhhbmRsZWAgaXMgbm90IHNldFxuICAgICAgdmFsdWU6IHJlcXVlc3QuaGFuZGxlLFxuICAgICAgb3V0cHV0OiBmYWxzZSxcbiAgICAgIGxlbmd0aDogdW5kZWZpbmVkLFxuICAgICAgcHJlY2lzaW9uOiB1bmRlZmluZWQsXG4gICAgICBzY2FsZTogdW5kZWZpbmVkXG4gICAgfSk7XG5cbiAgICB0aGlzLm1ha2VSZXF1ZXN0KHJlcXVlc3QsIFRZUEUuUlBDX1JFUVVFU1QsIG5ldyBScGNSZXF1ZXN0UGF5bG9hZChQcm9jZWR1cmVzLlNwX1VucHJlcGFyZSwgcGFyYW1ldGVycywgdGhpcy5jdXJyZW50VHJhbnNhY3Rpb25EZXNjcmlwdG9yKCksIHRoaXMuY29uZmlnLm9wdGlvbnMsIHRoaXMuZGF0YWJhc2VDb2xsYXRpb24pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlIHByZXZpb3VzbHkgcHJlcGFyZWQgU1FMLCB1c2luZyB0aGUgc3VwcGxpZWQgcGFyYW1ldGVycy5cbiAgICpcbiAgICogQHBhcmFtIHJlcXVlc3QgQSBwcmV2aW91c2x5IHByZXBhcmVkIFtbUmVxdWVzdF1dLlxuICAgKiBAcGFyYW0gcGFyYW1ldGVycyAgQW4gb2JqZWN0IHdob3NlIG5hbWVzIGNvcnJlc3BvbmQgdG8gdGhlIG5hbWVzIG9mXG4gICAqICAgcGFyYW1ldGVycyB0aGF0IHdlcmUgYWRkZWQgdG8gdGhlIFtbUmVxdWVzdF1dIGJlZm9yZSBpdCB3YXMgcHJlcGFyZWQuXG4gICAqICAgVGhlIG9iamVjdCdzIHZhbHVlcyBhcmUgcGFzc2VkIGFzIHRoZSBwYXJhbWV0ZXJzJyB2YWx1ZXMgd2hlbiB0aGVcbiAgICogICByZXF1ZXN0IGlzIGV4ZWN1dGVkLlxuICAgKi9cbiAgZXhlY3V0ZShyZXF1ZXN0OiBSZXF1ZXN0LCBwYXJhbWV0ZXJzPzogeyBba2V5OiBzdHJpbmddOiB1bmtub3duIH0pIHtcbiAgICBjb25zdCBleGVjdXRlUGFyYW1ldGVyczogUGFyYW1ldGVyW10gPSBbXTtcblxuICAgIGV4ZWN1dGVQYXJhbWV0ZXJzLnB1c2goe1xuICAgICAgdHlwZTogVFlQRVMuSW50LFxuICAgICAgbmFtZTogJycsXG4gICAgICAvLyBUT0RPOiBBYm9ydCBpZiBgcmVxdWVzdC5oYW5kbGVgIGlzIG5vdCBzZXRcbiAgICAgIHZhbHVlOiByZXF1ZXN0LmhhbmRsZSxcbiAgICAgIG91dHB1dDogZmFsc2UsXG4gICAgICBsZW5ndGg6IHVuZGVmaW5lZCxcbiAgICAgIHByZWNpc2lvbjogdW5kZWZpbmVkLFxuICAgICAgc2NhbGU6IHVuZGVmaW5lZFxuICAgIH0pO1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSByZXF1ZXN0LnBhcmFtZXRlcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgY29uc3QgcGFyYW1ldGVyID0gcmVxdWVzdC5wYXJhbWV0ZXJzW2ldO1xuXG4gICAgICAgIGV4ZWN1dGVQYXJhbWV0ZXJzLnB1c2goe1xuICAgICAgICAgIC4uLnBhcmFtZXRlcixcbiAgICAgICAgICB2YWx1ZTogcGFyYW1ldGVyLnR5cGUudmFsaWRhdGUocGFyYW1ldGVycyA/IHBhcmFtZXRlcnNbcGFyYW1ldGVyLm5hbWVdIDogbnVsbCwgdGhpcy5kYXRhYmFzZUNvbGxhdGlvbilcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgICAgcmVxdWVzdC5lcnJvciA9IGVycm9yO1xuXG4gICAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgdGhpcy5kZWJ1Zy5sb2coZXJyb3IubWVzc2FnZSk7XG4gICAgICAgIHJlcXVlc3QuY2FsbGJhY2soZXJyb3IpO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLm1ha2VSZXF1ZXN0KHJlcXVlc3QsIFRZUEUuUlBDX1JFUVVFU1QsIG5ldyBScGNSZXF1ZXN0UGF5bG9hZChQcm9jZWR1cmVzLlNwX0V4ZWN1dGUsIGV4ZWN1dGVQYXJhbWV0ZXJzLCB0aGlzLmN1cnJlbnRUcmFuc2FjdGlvbkRlc2NyaXB0b3IoKSwgdGhpcy5jb25maWcub3B0aW9ucywgdGhpcy5kYXRhYmFzZUNvbGxhdGlvbikpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGwgYSBzdG9yZWQgcHJvY2VkdXJlIHJlcHJlc2VudGVkIGJ5IFtbUmVxdWVzdF1dLlxuICAgKlxuICAgKiBAcGFyYW0gcmVxdWVzdCBBIFtbUmVxdWVzdF1dIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIHJlcXVlc3QuXG4gICAqL1xuICBjYWxsUHJvY2VkdXJlKHJlcXVlc3Q6IFJlcXVlc3QpIHtcbiAgICB0cnkge1xuICAgICAgcmVxdWVzdC52YWxpZGF0ZVBhcmFtZXRlcnModGhpcy5kYXRhYmFzZUNvbGxhdGlvbik7XG4gICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgICAgcmVxdWVzdC5lcnJvciA9IGVycm9yO1xuXG4gICAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgdGhpcy5kZWJ1Zy5sb2coZXJyb3IubWVzc2FnZSk7XG4gICAgICAgIHJlcXVlc3QuY2FsbGJhY2soZXJyb3IpO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLm1ha2VSZXF1ZXN0KHJlcXVlc3QsIFRZUEUuUlBDX1JFUVVFU1QsIG5ldyBScGNSZXF1ZXN0UGF5bG9hZChyZXF1ZXN0LnNxbFRleHRPclByb2NlZHVyZSEsIHJlcXVlc3QucGFyYW1ldGVycywgdGhpcy5jdXJyZW50VHJhbnNhY3Rpb25EZXNjcmlwdG9yKCksIHRoaXMuY29uZmlnLm9wdGlvbnMsIHRoaXMuZGF0YWJhc2VDb2xsYXRpb24pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCBhIHRyYW5zYWN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICogQHBhcmFtIG5hbWUgQSBzdHJpbmcgcmVwcmVzZW50aW5nIGEgbmFtZSB0byBhc3NvY2lhdGUgd2l0aCB0aGUgdHJhbnNhY3Rpb24uXG4gICAqICAgT3B0aW9uYWwsIGFuZCBkZWZhdWx0cyB0byBhbiBlbXB0eSBzdHJpbmcuIFJlcXVpcmVkIHdoZW4gYGlzb2xhdGlvbkxldmVsYFxuICAgKiAgIGlzIHByZXNlbnQuXG4gICAqIEBwYXJhbSBpc29sYXRpb25MZXZlbCBUaGUgaXNvbGF0aW9uIGxldmVsIHRoYXQgdGhlIHRyYW5zYWN0aW9uIGlzIHRvIGJlIHJ1biB3aXRoLlxuICAgKlxuICAgKiAgIFRoZSBpc29sYXRpb24gbGV2ZWxzIGFyZSBhdmFpbGFibGUgZnJvbSBgcmVxdWlyZSgndGVkaW91cycpLklTT0xBVElPTl9MRVZFTGAuXG4gICAqICAgKiBgUkVBRF9VTkNPTU1JVFRFRGBcbiAgICogICAqIGBSRUFEX0NPTU1JVFRFRGBcbiAgICogICAqIGBSRVBFQVRBQkxFX1JFQURgXG4gICAqICAgKiBgU0VSSUFMSVpBQkxFYFxuICAgKiAgICogYFNOQVBTSE9UYFxuICAgKlxuICAgKiAgIE9wdGlvbmFsLCBhbmQgZGVmYXVsdHMgdG8gdGhlIENvbm5lY3Rpb24ncyBpc29sYXRpb24gbGV2ZWwuXG4gICAqL1xuICBiZWdpblRyYW5zYWN0aW9uKGNhbGxiYWNrOiBCZWdpblRyYW5zYWN0aW9uQ2FsbGJhY2ssIG5hbWUgPSAnJywgaXNvbGF0aW9uTGV2ZWwgPSB0aGlzLmNvbmZpZy5vcHRpb25zLmlzb2xhdGlvbkxldmVsKSB7XG4gICAgYXNzZXJ0VmFsaWRJc29sYXRpb25MZXZlbChpc29sYXRpb25MZXZlbCwgJ2lzb2xhdGlvbkxldmVsJyk7XG5cbiAgICBjb25zdCB0cmFuc2FjdGlvbiA9IG5ldyBUcmFuc2FjdGlvbihuYW1lLCBpc29sYXRpb25MZXZlbCk7XG5cbiAgICBpZiAodGhpcy5jb25maWcub3B0aW9ucy50ZHNWZXJzaW9uIDwgJzdfMicpIHtcbiAgICAgIHJldHVybiB0aGlzLmV4ZWNTcWxCYXRjaChuZXcgUmVxdWVzdCgnU0VUIFRSQU5TQUNUSU9OIElTT0xBVElPTiBMRVZFTCAnICsgKHRyYW5zYWN0aW9uLmlzb2xhdGlvbkxldmVsVG9UU1FMKCkpICsgJztCRUdJTiBUUkFOICcgKyB0cmFuc2FjdGlvbi5uYW1lLCAoZXJyKSA9PiB7XG4gICAgICAgIHRoaXMudHJhbnNhY3Rpb25EZXB0aCsrO1xuICAgICAgICBpZiAodGhpcy50cmFuc2FjdGlvbkRlcHRoID09PSAxKSB7XG4gICAgICAgICAgdGhpcy5pblRyYW5zYWN0aW9uID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgfSkpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlcXVlc3QgPSBuZXcgUmVxdWVzdCh1bmRlZmluZWQsIChlcnIpID0+IHtcbiAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIHRoaXMuY3VycmVudFRyYW5zYWN0aW9uRGVzY3JpcHRvcigpKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5tYWtlUmVxdWVzdChyZXF1ZXN0LCBUWVBFLlRSQU5TQUNUSU9OX01BTkFHRVIsIHRyYW5zYWN0aW9uLmJlZ2luUGF5bG9hZCh0aGlzLmN1cnJlbnRUcmFuc2FjdGlvbkRlc2NyaXB0b3IoKSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbW1pdCBhIHRyYW5zYWN0aW9uLlxuICAgKlxuICAgKiBUaGVyZSBzaG91bGQgYmUgYW4gYWN0aXZlIHRyYW5zYWN0aW9uIC0gdGhhdCBpcywgW1tiZWdpblRyYW5zYWN0aW9uXV1cbiAgICogc2hvdWxkIGhhdmUgYmVlbiBwcmV2aW91c2x5IGNhbGxlZC5cbiAgICpcbiAgICogQHBhcmFtIGNhbGxiYWNrXG4gICAqIEBwYXJhbSBuYW1lIEEgc3RyaW5nIHJlcHJlc2VudGluZyBhIG5hbWUgdG8gYXNzb2NpYXRlIHdpdGggdGhlIHRyYW5zYWN0aW9uLlxuICAgKiAgIE9wdGlvbmFsLCBhbmQgZGVmYXVsdHMgdG8gYW4gZW1wdHkgc3RyaW5nLiBSZXF1aXJlZCB3aGVuIGBpc29sYXRpb25MZXZlbGBpcyBwcmVzZW50LlxuICAgKi9cbiAgY29tbWl0VHJhbnNhY3Rpb24oY2FsbGJhY2s6IENvbW1pdFRyYW5zYWN0aW9uQ2FsbGJhY2ssIG5hbWUgPSAnJykge1xuICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gbmV3IFRyYW5zYWN0aW9uKG5hbWUpO1xuICAgIGlmICh0aGlzLmNvbmZpZy5vcHRpb25zLnRkc1ZlcnNpb24gPCAnN18yJykge1xuICAgICAgcmV0dXJuIHRoaXMuZXhlY1NxbEJhdGNoKG5ldyBSZXF1ZXN0KCdDT01NSVQgVFJBTiAnICsgdHJhbnNhY3Rpb24ubmFtZSwgKGVycikgPT4ge1xuICAgICAgICB0aGlzLnRyYW5zYWN0aW9uRGVwdGgtLTtcbiAgICAgICAgaWYgKHRoaXMudHJhbnNhY3Rpb25EZXB0aCA9PT0gMCkge1xuICAgICAgICAgIHRoaXMuaW5UcmFuc2FjdGlvbiA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgIH0pKTtcbiAgICB9XG4gICAgY29uc3QgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KHVuZGVmaW5lZCwgY2FsbGJhY2spO1xuICAgIHJldHVybiB0aGlzLm1ha2VSZXF1ZXN0KHJlcXVlc3QsIFRZUEUuVFJBTlNBQ1RJT05fTUFOQUdFUiwgdHJhbnNhY3Rpb24uY29tbWl0UGF5bG9hZCh0aGlzLmN1cnJlbnRUcmFuc2FjdGlvbkRlc2NyaXB0b3IoKSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJvbGxiYWNrIGEgdHJhbnNhY3Rpb24uXG4gICAqXG4gICAqIFRoZXJlIHNob3VsZCBiZSBhbiBhY3RpdmUgdHJhbnNhY3Rpb24gLSB0aGF0IGlzLCBbW2JlZ2luVHJhbnNhY3Rpb25dXVxuICAgKiBzaG91bGQgaGF2ZSBiZWVuIHByZXZpb3VzbHkgY2FsbGVkLlxuICAgKlxuICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICogQHBhcmFtIG5hbWUgQSBzdHJpbmcgcmVwcmVzZW50aW5nIGEgbmFtZSB0byBhc3NvY2lhdGUgd2l0aCB0aGUgdHJhbnNhY3Rpb24uXG4gICAqICAgT3B0aW9uYWwsIGFuZCBkZWZhdWx0cyB0byBhbiBlbXB0eSBzdHJpbmcuXG4gICAqICAgUmVxdWlyZWQgd2hlbiBgaXNvbGF0aW9uTGV2ZWxgIGlzIHByZXNlbnQuXG4gICAqL1xuICByb2xsYmFja1RyYW5zYWN0aW9uKGNhbGxiYWNrOiBSb2xsYmFja1RyYW5zYWN0aW9uQ2FsbGJhY2ssIG5hbWUgPSAnJykge1xuICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gbmV3IFRyYW5zYWN0aW9uKG5hbWUpO1xuICAgIGlmICh0aGlzLmNvbmZpZy5vcHRpb25zLnRkc1ZlcnNpb24gPCAnN18yJykge1xuICAgICAgcmV0dXJuIHRoaXMuZXhlY1NxbEJhdGNoKG5ldyBSZXF1ZXN0KCdST0xMQkFDSyBUUkFOICcgKyB0cmFuc2FjdGlvbi5uYW1lLCAoZXJyKSA9PiB7XG4gICAgICAgIHRoaXMudHJhbnNhY3Rpb25EZXB0aC0tO1xuICAgICAgICBpZiAodGhpcy50cmFuc2FjdGlvbkRlcHRoID09PSAwKSB7XG4gICAgICAgICAgdGhpcy5pblRyYW5zYWN0aW9uID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgIH0pKTtcbiAgICB9XG4gICAgY29uc3QgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KHVuZGVmaW5lZCwgY2FsbGJhY2spO1xuICAgIHJldHVybiB0aGlzLm1ha2VSZXF1ZXN0KHJlcXVlc3QsIFRZUEUuVFJBTlNBQ1RJT05fTUFOQUdFUiwgdHJhbnNhY3Rpb24ucm9sbGJhY2tQYXlsb2FkKHRoaXMuY3VycmVudFRyYW5zYWN0aW9uRGVzY3JpcHRvcigpKSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0IGEgc2F2ZXBvaW50IHdpdGhpbiBhIHRyYW5zYWN0aW9uLlxuICAgKlxuICAgKiBUaGVyZSBzaG91bGQgYmUgYW4gYWN0aXZlIHRyYW5zYWN0aW9uIC0gdGhhdCBpcywgW1tiZWdpblRyYW5zYWN0aW9uXV1cbiAgICogc2hvdWxkIGhhdmUgYmVlbiBwcmV2aW91c2x5IGNhbGxlZC5cbiAgICpcbiAgICogQHBhcmFtIGNhbGxiYWNrXG4gICAqIEBwYXJhbSBuYW1lIEEgc3RyaW5nIHJlcHJlc2VudGluZyBhIG5hbWUgdG8gYXNzb2NpYXRlIHdpdGggdGhlIHRyYW5zYWN0aW9uLlxcXG4gICAqICAgT3B0aW9uYWwsIGFuZCBkZWZhdWx0cyB0byBhbiBlbXB0eSBzdHJpbmcuXG4gICAqICAgUmVxdWlyZWQgd2hlbiBgaXNvbGF0aW9uTGV2ZWxgIGlzIHByZXNlbnQuXG4gICAqL1xuICBzYXZlVHJhbnNhY3Rpb24oY2FsbGJhY2s6IFNhdmVUcmFuc2FjdGlvbkNhbGxiYWNrLCBuYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCB0cmFuc2FjdGlvbiA9IG5ldyBUcmFuc2FjdGlvbihuYW1lKTtcbiAgICBpZiAodGhpcy5jb25maWcub3B0aW9ucy50ZHNWZXJzaW9uIDwgJzdfMicpIHtcbiAgICAgIHJldHVybiB0aGlzLmV4ZWNTcWxCYXRjaChuZXcgUmVxdWVzdCgnU0FWRSBUUkFOICcgKyB0cmFuc2FjdGlvbi5uYW1lLCAoZXJyKSA9PiB7XG4gICAgICAgIHRoaXMudHJhbnNhY3Rpb25EZXB0aCsrO1xuICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgfSkpO1xuICAgIH1cbiAgICBjb25zdCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QodW5kZWZpbmVkLCBjYWxsYmFjayk7XG4gICAgcmV0dXJuIHRoaXMubWFrZVJlcXVlc3QocmVxdWVzdCwgVFlQRS5UUkFOU0FDVElPTl9NQU5BR0VSLCB0cmFuc2FjdGlvbi5zYXZlUGF5bG9hZCh0aGlzLmN1cnJlbnRUcmFuc2FjdGlvbkRlc2NyaXB0b3IoKSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJ1biB0aGUgZ2l2ZW4gY2FsbGJhY2sgYWZ0ZXIgc3RhcnRpbmcgYSB0cmFuc2FjdGlvbiwgYW5kIGNvbW1pdCBvclxuICAgKiByb2xsYmFjayB0aGUgdHJhbnNhY3Rpb24gYWZ0ZXJ3YXJkcy5cbiAgICpcbiAgICogVGhpcyBpcyBhIGhlbHBlciB0aGF0IGVtcGxveXMgW1tiZWdpblRyYW5zYWN0aW9uXV0sIFtbY29tbWl0VHJhbnNhY3Rpb25dXSxcbiAgICogW1tyb2xsYmFja1RyYW5zYWN0aW9uXV0sIGFuZCBbW3NhdmVUcmFuc2FjdGlvbl1dIHRvIGdyZWF0bHkgc2ltcGxpZnkgdGhlXG4gICAqIHVzZSBvZiBkYXRhYmFzZSB0cmFuc2FjdGlvbnMgYW5kIGF1dG9tYXRpY2FsbHkgaGFuZGxlIHRyYW5zYWN0aW9uIG5lc3RpbmcuXG4gICAqXG4gICAqIEBwYXJhbSBjYlxuICAgKiBAcGFyYW0gaXNvbGF0aW9uTGV2ZWxcbiAgICogICBUaGUgaXNvbGF0aW9uIGxldmVsIHRoYXQgdGhlIHRyYW5zYWN0aW9uIGlzIHRvIGJlIHJ1biB3aXRoLlxuICAgKlxuICAgKiAgIFRoZSBpc29sYXRpb24gbGV2ZWxzIGFyZSBhdmFpbGFibGUgZnJvbSBgcmVxdWlyZSgndGVkaW91cycpLklTT0xBVElPTl9MRVZFTGAuXG4gICAqICAgKiBgUkVBRF9VTkNPTU1JVFRFRGBcbiAgICogICAqIGBSRUFEX0NPTU1JVFRFRGBcbiAgICogICAqIGBSRVBFQVRBQkxFX1JFQURgXG4gICAqICAgKiBgU0VSSUFMSVpBQkxFYFxuICAgKiAgICogYFNOQVBTSE9UYFxuICAgKlxuICAgKiAgIE9wdGlvbmFsLCBhbmQgZGVmYXVsdHMgdG8gdGhlIENvbm5lY3Rpb24ncyBpc29sYXRpb24gbGV2ZWwuXG4gICAqL1xuICB0cmFuc2FjdGlvbihjYjogKGVycjogRXJyb3IgfCBudWxsIHwgdW5kZWZpbmVkLCB0eERvbmU/OiA8VCBleHRlbmRzIFRyYW5zYWN0aW9uRG9uZUNhbGxiYWNrPihlcnI6IEVycm9yIHwgbnVsbCB8IHVuZGVmaW5lZCwgZG9uZTogVCwgLi4uYXJnczogQ2FsbGJhY2tQYXJhbWV0ZXJzPFQ+KSA9PiB2b2lkKSA9PiB2b2lkLCBpc29sYXRpb25MZXZlbD86IHR5cGVvZiBJU09MQVRJT05fTEVWRUxba2V5b2YgdHlwZW9mIElTT0xBVElPTl9MRVZFTF0pIHtcbiAgICBpZiAodHlwZW9mIGNiICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdgY2JgIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICAgIH1cblxuICAgIGNvbnN0IHVzZVNhdmVwb2ludCA9IHRoaXMuaW5UcmFuc2FjdGlvbjtcbiAgICBjb25zdCBuYW1lID0gJ190ZWRpb3VzXycgKyAoY3J5cHRvLnJhbmRvbUJ5dGVzKDEwKS50b1N0cmluZygnaGV4JykpO1xuICAgIGNvbnN0IHR4RG9uZTogPFQgZXh0ZW5kcyBUcmFuc2FjdGlvbkRvbmVDYWxsYmFjaz4oZXJyOiBFcnJvciB8IG51bGwgfCB1bmRlZmluZWQsIGRvbmU6IFQsIC4uLmFyZ3M6IENhbGxiYWNrUGFyYW1ldGVyczxUPikgPT4gdm9pZCA9IChlcnIsIGRvbmUsIC4uLmFyZ3MpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgaWYgKHRoaXMuaW5UcmFuc2FjdGlvbiAmJiB0aGlzLnN0YXRlID09PSB0aGlzLlNUQVRFLkxPR0dFRF9JTikge1xuICAgICAgICAgIHRoaXMucm9sbGJhY2tUcmFuc2FjdGlvbigodHhFcnIpID0+IHtcbiAgICAgICAgICAgIGRvbmUodHhFcnIgfHwgZXJyLCAuLi5hcmdzKTtcbiAgICAgICAgICB9LCBuYW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkb25lKGVyciwgLi4uYXJncyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodXNlU2F2ZXBvaW50KSB7XG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5vcHRpb25zLnRkc1ZlcnNpb24gPCAnN18yJykge1xuICAgICAgICAgIHRoaXMudHJhbnNhY3Rpb25EZXB0aC0tO1xuICAgICAgICB9XG4gICAgICAgIGRvbmUobnVsbCwgLi4uYXJncyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNvbW1pdFRyYW5zYWN0aW9uKCh0eEVycikgPT4ge1xuICAgICAgICAgIGRvbmUodHhFcnIsIC4uLmFyZ3MpO1xuICAgICAgICB9LCBuYW1lKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKHVzZVNhdmVwb2ludCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2F2ZVRyYW5zYWN0aW9uKChlcnIpID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzb2xhdGlvbkxldmVsKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZXhlY1NxbEJhdGNoKG5ldyBSZXF1ZXN0KCdTRVQgdHJhbnNhY3Rpb24gaXNvbGF0aW9uIGxldmVsICcgKyB0aGlzLmdldElzb2xhdGlvbkxldmVsVGV4dChpc29sYXRpb25MZXZlbCksIChlcnIpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBjYihlcnIsIHR4RG9uZSk7XG4gICAgICAgICAgfSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBjYihudWxsLCB0eERvbmUpO1xuICAgICAgICB9XG4gICAgICB9LCBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuYmVnaW5UcmFuc2FjdGlvbigoZXJyKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjYihudWxsLCB0eERvbmUpO1xuICAgICAgfSwgbmFtZSwgaXNvbGF0aW9uTGV2ZWwpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgbWFrZVJlcXVlc3QocmVxdWVzdDogUmVxdWVzdCB8IEJ1bGtMb2FkLCBwYWNrZXRUeXBlOiBudW1iZXIsIHBheWxvYWQ6IChJdGVyYWJsZTxCdWZmZXI+IHwgQXN5bmNJdGVyYWJsZTxCdWZmZXI+KSAmIHsgdG9TdHJpbmc6IChpbmRlbnQ/OiBzdHJpbmcpID0+IHN0cmluZyB9KSB7XG4gICAgaWYgKHRoaXMuc3RhdGUgIT09IHRoaXMuU1RBVEUuTE9HR0VEX0lOKSB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gJ1JlcXVlc3RzIGNhbiBvbmx5IGJlIG1hZGUgaW4gdGhlICcgKyB0aGlzLlNUQVRFLkxPR0dFRF9JTi5uYW1lICsgJyBzdGF0ZSwgbm90IHRoZSAnICsgdGhpcy5zdGF0ZS5uYW1lICsgJyBzdGF0ZSc7XG4gICAgICB0aGlzLmRlYnVnLmxvZyhtZXNzYWdlKTtcbiAgICAgIHJlcXVlc3QuY2FsbGJhY2sobmV3IFJlcXVlc3RFcnJvcihtZXNzYWdlLCAnRUlOVkFMSURTVEFURScpKTtcbiAgICB9IGVsc2UgaWYgKHJlcXVlc3QuY2FuY2VsZWQpIHtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge1xuICAgICAgICByZXF1ZXN0LmNhbGxiYWNrKG5ldyBSZXF1ZXN0RXJyb3IoJ0NhbmNlbGVkLicsICdFQ0FOQ0VMJykpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChwYWNrZXRUeXBlID09PSBUWVBFLlNRTF9CQVRDSCkge1xuICAgICAgICB0aGlzLmlzU3FsQmF0Y2ggPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5pc1NxbEJhdGNoID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucmVxdWVzdCA9IHJlcXVlc3Q7XG4gICAgICB0aGlzLmF0dGVudGlvblNlbnQgPSBmYWxzZTtcbiAgICAgIHJlcXVlc3QuY29ubmVjdGlvbiEgPSB0aGlzO1xuICAgICAgcmVxdWVzdC5yb3dDb3VudCEgPSAwO1xuICAgICAgcmVxdWVzdC5yb3dzISA9IFtdO1xuICAgICAgcmVxdWVzdC5yc3QhID0gW107XG5cbiAgICAgIGNvbnN0IG9uQ2FuY2VsID0gKCkgPT4ge1xuICAgICAgICBwYXlsb2FkU3RyZWFtLnVucGlwZShtZXNzYWdlKTtcbiAgICAgICAgcGF5bG9hZFN0cmVhbS5kZXN0cm95KCk7XG5cbiAgICAgICAgLy8gVGhlIHJlcXVlc3QgZXJyb3IgbWlnaHQgYWxyZWFkeSBiZSBzZXQsIGUuZy4gaWYgdGhlIHBheWxvYWRcbiAgICAgICAgLy8gc3RyZWFtIGVycm9yZWQgYmVmb3JlIHRoZSBjYW5jZWxsYXRpb24uXG4gICAgICAgIHJlcXVlc3QuZXJyb3IgPz89IG5ldyBSZXF1ZXN0RXJyb3IoJ0NhbmNlbGVkLicsICdFQ0FOQ0VMJyk7XG5cbiAgICAgICAgLy8gc2V0IHRoZSBpZ25vcmUgYml0IGFuZCBlbmQgdGhlIG1lc3NhZ2UuXG4gICAgICAgIG1lc3NhZ2UuaWdub3JlID0gdHJ1ZTtcbiAgICAgICAgbWVzc2FnZS5lbmQoKTtcblxuICAgICAgICBpZiAocmVxdWVzdCBpbnN0YW5jZW9mIFJlcXVlc3QgJiYgcmVxdWVzdC5wYXVzZWQpIHtcbiAgICAgICAgICAvLyByZXN1bWUgdGhlIHJlcXVlc3QgaWYgaXQgd2FzIHBhdXNlZCBzbyB3ZSBjYW4gcmVhZCB0aGUgcmVtYWluaW5nIHRva2Vuc1xuICAgICAgICAgIHJlcXVlc3QucmVzdW1lKCk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHJlcXVlc3Qub25jZSgnY2FuY2VsJywgb25DYW5jZWwpO1xuXG4gICAgICB0aGlzLmNyZWF0ZVJlcXVlc3RUaW1lcigpO1xuXG4gICAgICBjb25zdCBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoeyB0eXBlOiBwYWNrZXRUeXBlLCByZXNldENvbm5lY3Rpb246IHRoaXMucmVzZXRDb25uZWN0aW9uT25OZXh0UmVxdWVzdCB9KTtcbiAgICAgIHRoaXMubWVzc2FnZUlvLm91dGdvaW5nTWVzc2FnZVN0cmVhbS53cml0ZShtZXNzYWdlKTtcbiAgICAgIHRoaXMudHJhbnNpdGlvblRvKHRoaXMuU1RBVEUuU0VOVF9DTElFTlRfUkVRVUVTVCk7XG5cbiAgICAgIG1lc3NhZ2Uub25jZSgnZmluaXNoJywgKCkgPT4ge1xuICAgICAgICByZXF1ZXN0LnJlbW92ZUxpc3RlbmVyKCdjYW5jZWwnLCBvbkNhbmNlbCk7XG4gICAgICAgIC8vIFByZXBlbmQgdGhlIGxpc3RlbmVyIHNvIGl0IGFsd2F5cyBydW5zIGJlZm9yZSB0aGVcbiAgICAgICAgLy8gYFNlbnRDbGllbnRSZXF1ZXN0YCBzdGF0ZSdzIGBjYW5jZWxgIGhhbmRsZXIsIHJlZ2FyZGxlc3Mgb2YgdGhlXG4gICAgICAgIC8vIG9yZGVyIGluIHdoaWNoIHRoZSB0d28gd2VyZSByZWdpc3RlcmVkLiBUaGUgbGF0dGVyIHJlbGllcyBvblxuICAgICAgICAvLyBgYXR0ZW50aW9uU2VudGAgYWxyZWFkeSBiZWluZyBzZXQsIHdoaWNoIG9ubHkgdGhpcyBsaXN0ZW5lciBkb2VzLlxuICAgICAgICByZXF1ZXN0LnByZXBlbmRPbmNlTGlzdGVuZXIoJ2NhbmNlbCcsIHRoaXMuX2NhbmNlbEFmdGVyUmVxdWVzdFNlbnQpO1xuXG4gICAgICAgIHRoaXMucmVzZXRDb25uZWN0aW9uT25OZXh0UmVxdWVzdCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRlYnVnLnBheWxvYWQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIHBheWxvYWQhLnRvU3RyaW5nKCcgICcpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBwYXlsb2FkU3RyZWFtID0gUmVhZGFibGUuZnJvbShwYXlsb2FkKTtcbiAgICAgIHBheWxvYWRTdHJlYW0ub25jZSgnZXJyb3InLCAoZXJyb3IpID0+IHtcbiAgICAgICAgcGF5bG9hZFN0cmVhbS51bnBpcGUobWVzc2FnZSk7XG5cbiAgICAgICAgLy8gT25seSBzZXQgYSByZXF1ZXN0IGVycm9yIGlmIG5vIGVycm9yIHdhcyBzZXQgeWV0LlxuICAgICAgICByZXF1ZXN0LmVycm9yID8/PSBlcnJvcjtcblxuICAgICAgICBtZXNzYWdlLmlnbm9yZSA9IHRydWU7XG4gICAgICAgIG1lc3NhZ2UuZW5kKCk7XG4gICAgICB9KTtcbiAgICAgIHBheWxvYWRTdHJlYW0ucGlwZShtZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FuY2VsIGN1cnJlbnRseSBleGVjdXRlZCByZXF1ZXN0LlxuICAgKi9cbiAgY2FuY2VsKCkge1xuICAgIGlmICghdGhpcy5yZXF1ZXN0KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVxdWVzdC5jYW5jZWxlZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMucmVxdWVzdC5jYW5jZWwoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCB0aGUgY29ubmVjdGlvbiB0byBpdHMgaW5pdGlhbCBzdGF0ZS5cbiAgICogQ2FuIGJlIHVzZWZ1bCBmb3IgY29ubmVjdGlvbiBwb29sIGltcGxlbWVudGF0aW9ucy5cbiAgICpcbiAgICogQHBhcmFtIGNhbGxiYWNrXG4gICAqL1xuICByZXNldChjYWxsYmFjazogUmVzZXRDYWxsYmFjaykge1xuICAgIGNvbnN0IHJlcXVlc3QgPSBuZXcgUmVxdWVzdCh0aGlzLmdldEluaXRpYWxTcWwoKSwgKGVycikgPT4ge1xuICAgICAgaWYgKHRoaXMuY29uZmlnLm9wdGlvbnMudGRzVmVyc2lvbiA8ICc3XzInKSB7XG4gICAgICAgIHRoaXMuaW5UcmFuc2FjdGlvbiA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICB9KTtcbiAgICB0aGlzLnJlc2V0Q29ubmVjdGlvbk9uTmV4dFJlcXVlc3QgPSB0cnVlO1xuICAgIHRoaXMuZXhlY1NxbEJhdGNoKHJlcXVlc3QpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjdXJyZW50VHJhbnNhY3Rpb25EZXNjcmlwdG9yKCkge1xuICAgIHJldHVybiB0aGlzLnRyYW5zYWN0aW9uRGVzY3JpcHRvcnNbdGhpcy50cmFuc2FjdGlvbkRlc2NyaXB0b3JzLmxlbmd0aCAtIDFdO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXRJc29sYXRpb25MZXZlbFRleHQoaXNvbGF0aW9uTGV2ZWw6IHR5cGVvZiBJU09MQVRJT05fTEVWRUxba2V5b2YgdHlwZW9mIElTT0xBVElPTl9MRVZFTF0pIHtcbiAgICBzd2l0Y2ggKGlzb2xhdGlvbkxldmVsKSB7XG4gICAgICBjYXNlIElTT0xBVElPTl9MRVZFTC5SRUFEX1VOQ09NTUlUVEVEOlxuICAgICAgICByZXR1cm4gJ3JlYWQgdW5jb21taXR0ZWQnO1xuICAgICAgY2FzZSBJU09MQVRJT05fTEVWRUwuUkVQRUFUQUJMRV9SRUFEOlxuICAgICAgICByZXR1cm4gJ3JlcGVhdGFibGUgcmVhZCc7XG4gICAgICBjYXNlIElTT0xBVElPTl9MRVZFTC5TRVJJQUxJWkFCTEU6XG4gICAgICAgIHJldHVybiAnc2VyaWFsaXphYmxlJztcbiAgICAgIGNhc2UgSVNPTEFUSU9OX0xFVkVMLlNOQVBTSE9UOlxuICAgICAgICByZXR1cm4gJ3NuYXBzaG90JztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiAncmVhZCBjb21taXR0ZWQnO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgYXN5bmMgcGVyZm9ybVRsc05lZ290aWF0aW9uKHByZWxvZ2luUGF5bG9hZDogUHJlbG9naW5QYXlsb2FkLCBzaWduYWw6IEFib3J0U2lnbmFsKSB7XG4gICAgc2lnbmFsLnRocm93SWZBYm9ydGVkKCk7XG5cbiAgICBjb25zdCB7IHByb21pc2U6IHNpZ25hbEFib3J0ZWQsIHJlamVjdCB9ID0gd2l0aFJlc29sdmVyczxuZXZlcj4oKTtcblxuICAgIGNvbnN0IG9uQWJvcnQgPSAoKSA9PiB7IHJlamVjdChzaWduYWwucmVhc29uKTsgfTtcbiAgICBzaWduYWwuYWRkRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBvbkFib3J0LCB7IG9uY2U6IHRydWUgfSk7XG5cbiAgICB0cnkge1xuICAgICAgaWYgKHByZWxvZ2luUGF5bG9hZC5mZWRBdXRoUmVxdWlyZWQgPT09IDEpIHtcbiAgICAgICAgdGhpcy5mZWRBdXRoUmVxdWlyZWQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKCdzdHJpY3QnICE9PSB0aGlzLmNvbmZpZy5vcHRpb25zLmVuY3J5cHQgJiYgKHByZWxvZ2luUGF5bG9hZC5lbmNyeXB0aW9uU3RyaW5nID09PSAnT04nIHx8IHByZWxvZ2luUGF5bG9hZC5lbmNyeXB0aW9uU3RyaW5nID09PSAnUkVRJykpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5vcHRpb25zLmVuY3J5cHQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgQ29ubmVjdGlvbkVycm9yKFwiU2VydmVyIHJlcXVpcmVzIGVuY3J5cHRpb24sIHNldCAnZW5jcnlwdCcgY29uZmlnIG9wdGlvbiB0byB0cnVlLlwiLCAnRUVOQ1JZUFQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudHJhbnNpdGlvblRvKHRoaXMuU1RBVEUuU0VOVF9UTFNTU0xORUdPVElBVElPTik7XG4gICAgICAgIGF3YWl0IFByb21pc2UucmFjZShbXG4gICAgICAgICAgdGhpcy5tZXNzYWdlSW8uc3RhcnRUbHModGhpcy5zZWN1cmVDb250ZXh0T3B0aW9ucywgdGhpcy5jb25maWcub3B0aW9ucy5zZXJ2ZXJOYW1lID8gdGhpcy5jb25maWcub3B0aW9ucy5zZXJ2ZXJOYW1lIDogdGhpcy5yb3V0aW5nRGF0YT8uc2VydmVyID8/IHRoaXMuY29uZmlnLnNlcnZlciwgdGhpcy5jb25maWcub3B0aW9ucy50cnVzdFNlcnZlckNlcnRpZmljYXRlKS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICB0aHJvdyB0aGlzLndyYXBTb2NrZXRFcnJvcihlcnIpO1xuICAgICAgICAgIH0pLFxuICAgICAgICAgIHNpZ25hbEFib3J0ZWRcbiAgICAgICAgXSk7XG4gICAgICB9XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIG9uQWJvcnQpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHJlYWRQcmVsb2dpblJlc3BvbnNlKHNpZ25hbDogQWJvcnRTaWduYWwpOiBQcm9taXNlPFByZWxvZ2luUGF5bG9hZD4ge1xuICAgIHNpZ25hbC50aHJvd0lmQWJvcnRlZCgpO1xuXG4gICAgbGV0IG1lc3NhZ2VCdWZmZXIgPSBCdWZmZXIuYWxsb2MoMCk7XG5cbiAgICBjb25zdCB7IHByb21pc2U6IHNpZ25hbEFib3J0ZWQsIHJlamVjdCB9ID0gd2l0aFJlc29sdmVyczxuZXZlcj4oKTtcblxuICAgIGNvbnN0IG9uQWJvcnQgPSAoKSA9PiB7IHJlamVjdChzaWduYWwucmVhc29uKTsgfTtcbiAgICBzaWduYWwuYWRkRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBvbkFib3J0LCB7IG9uY2U6IHRydWUgfSk7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IGF3YWl0IFByb21pc2UucmFjZShbXG4gICAgICAgIHRoaXMubWVzc2FnZUlvLnJlYWRNZXNzYWdlKCkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgIHRocm93IHRoaXMud3JhcFNvY2tldEVycm9yKGVycik7XG4gICAgICAgIH0pLFxuICAgICAgICBzaWduYWxBYm9ydGVkXG4gICAgICBdKTtcblxuICAgICAgY29uc3QgaXRlcmF0b3IgPSBtZXNzYWdlW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSgpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICBjb25zdCB7IGRvbmUsIHZhbHVlIH0gPSBhd2FpdCBQcm9taXNlLnJhY2UoW1xuICAgICAgICAgICAgaXRlcmF0b3IubmV4dCgpLFxuICAgICAgICAgICAgc2lnbmFsQWJvcnRlZFxuICAgICAgICAgIF0pO1xuXG4gICAgICAgICAgaWYgKGRvbmUpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG1lc3NhZ2VCdWZmZXIgPSBCdWZmZXIuY29uY2F0KFttZXNzYWdlQnVmZmVyLCB2YWx1ZV0pO1xuICAgICAgICB9XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoaXRlcmF0b3IucmV0dXJuKSB7XG4gICAgICAgICAgYXdhaXQgaXRlcmF0b3IucmV0dXJuKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb25BYm9ydCk7XG4gICAgfVxuXG4gICAgY29uc3QgcHJlbG9naW5QYXlsb2FkID0gbmV3IFByZWxvZ2luUGF5bG9hZChtZXNzYWdlQnVmZmVyKTtcbiAgICB0aGlzLmRlYnVnLnBheWxvYWQoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcHJlbG9naW5QYXlsb2FkLnRvU3RyaW5nKCcgICcpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcmVsb2dpblBheWxvYWQ7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGFzeW5jIHBlcmZvcm1SZVJvdXRpbmcoKSB7XG4gICAgdGhpcy5zb2NrZXQhLnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIHRoaXMuX29uU29ja2V0RXJyb3IpO1xuICAgIHRoaXMuc29ja2V0IS5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCB0aGlzLl9vblNvY2tldENsb3NlKTtcbiAgICB0aGlzLnNvY2tldCEucmVtb3ZlTGlzdGVuZXIoJ2VuZCcsIHRoaXMuX29uU29ja2V0RW5kKTtcbiAgICB0aGlzLnNvY2tldCEuZGVzdHJveSgpO1xuXG4gICAgdGhpcy5kZWJ1Zy5sb2coJ2Nvbm5lY3Rpb24gdG8gJyArIHRoaXMuY29uZmlnLnNlcnZlciArICc6JyArIHRoaXMuY29uZmlnLm9wdGlvbnMucG9ydCArICcgY2xvc2VkJyk7XG5cbiAgICB0aGlzLmVtaXQoJ3Jlcm91dGluZycpO1xuICAgIHRoaXMuZGVidWcubG9nKCdSZXJvdXRpbmcgdG8gJyArIHRoaXMucm91dGluZ0RhdGEhLnNlcnZlciArICc6JyArIHRoaXMucm91dGluZ0RhdGEhLnBvcnQpO1xuXG4gICAgLy8gQXR0ZW1wdCBjb25uZWN0aW5nIHRvIHRoZSByZXJvdXRpbmcgdGFyZ2V0XG4gICAgdGhpcy50cmFuc2l0aW9uVG8odGhpcy5TVEFURS5DT05ORUNUSU5HKTtcbiAgICBhd2FpdCB0aGlzLmluaXRpYWxpc2VDb25uZWN0aW9uKCk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGFzeW5jIHBlcmZvcm1UcmFuc2llbnRGYWlsdXJlUmV0cnkoKSB7XG4gICAgdGhpcy5jdXJUcmFuc2llbnRSZXRyeUNvdW50Kys7XG5cbiAgICB0aGlzLnNvY2tldCEucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgdGhpcy5fb25Tb2NrZXRFcnJvcik7XG4gICAgdGhpcy5zb2NrZXQhLnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIHRoaXMuX29uU29ja2V0Q2xvc2UpO1xuICAgIHRoaXMuc29ja2V0IS5yZW1vdmVMaXN0ZW5lcignZW5kJywgdGhpcy5fb25Tb2NrZXRFbmQpO1xuICAgIHRoaXMuc29ja2V0IS5kZXN0cm95KCk7XG5cbiAgICB0aGlzLmRlYnVnLmxvZygnY29ubmVjdGlvbiB0byAnICsgdGhpcy5jb25maWcuc2VydmVyICsgJzonICsgdGhpcy5jb25maWcub3B0aW9ucy5wb3J0ICsgJyBjbG9zZWQnKTtcblxuICAgIGNvbnN0IHNlcnZlciA9IHRoaXMucm91dGluZ0RhdGEgPyB0aGlzLnJvdXRpbmdEYXRhLnNlcnZlciA6IHRoaXMuY29uZmlnLnNlcnZlcjtcbiAgICBjb25zdCBwb3J0ID0gdGhpcy5yb3V0aW5nRGF0YSA/IHRoaXMucm91dGluZ0RhdGEucG9ydCA6IHRoaXMuY29uZmlnLm9wdGlvbnMucG9ydDtcbiAgICB0aGlzLmRlYnVnLmxvZygnUmV0cnkgYWZ0ZXIgdHJhbnNpZW50IGZhaWx1cmUgY29ubmVjdGluZyB0byAnICsgc2VydmVyICsgJzonICsgcG9ydCk7XG5cbiAgICBjb25zdCB7IHByb21pc2UsIHJlc29sdmUgfSA9IHdpdGhSZXNvbHZlcnM8dm9pZD4oKTtcbiAgICBzZXRUaW1lb3V0KHJlc29sdmUsIHRoaXMuY29uZmlnLm9wdGlvbnMuY29ubmVjdGlvblJldHJ5SW50ZXJ2YWwpO1xuICAgIGF3YWl0IHByb21pc2U7XG5cbiAgICB0aGlzLmVtaXQoJ3JldHJ5Jyk7XG4gICAgdGhpcy50cmFuc2l0aW9uVG8odGhpcy5TVEFURS5DT05ORUNUSU5HKTtcbiAgICBhd2FpdCB0aGlzLmluaXRpYWxpc2VDb25uZWN0aW9uKCk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGFzeW5jIHBlcmZvcm1TZW50TG9naW43V2l0aFN0YW5kYXJkTG9naW4oc2lnbmFsOiBBYm9ydFNpZ25hbCk6IFByb21pc2U8Um91dGluZ0RhdGEgfCB1bmRlZmluZWQ+IHtcbiAgICBzaWduYWwudGhyb3dJZkFib3J0ZWQoKTtcblxuICAgIGNvbnN0IHsgcHJvbWlzZTogc2lnbmFsQWJvcnRlZCwgcmVqZWN0IH0gPSB3aXRoUmVzb2x2ZXJzPG5ldmVyPigpO1xuXG4gICAgY29uc3Qgb25BYm9ydCA9ICgpID0+IHsgcmVqZWN0KHNpZ25hbC5yZWFzb24pOyB9O1xuICAgIHNpZ25hbC5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsIG9uQWJvcnQsIHsgb25jZTogdHJ1ZSB9KTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gYXdhaXQgUHJvbWlzZS5yYWNlKFtcbiAgICAgICAgdGhpcy5tZXNzYWdlSW8ucmVhZE1lc3NhZ2UoKS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgdGhyb3cgdGhpcy53cmFwU29ja2V0RXJyb3IoZXJyKTtcbiAgICAgICAgfSksXG4gICAgICAgIHNpZ25hbEFib3J0ZWRcbiAgICAgIF0pO1xuXG4gICAgICBjb25zdCBoYW5kbGVyID0gbmV3IExvZ2luN1Rva2VuSGFuZGxlcih0aGlzKTtcbiAgICAgIGNvbnN0IHRva2VuU3RyZWFtUGFyc2VyID0gdGhpcy5jcmVhdGVUb2tlblN0cmVhbVBhcnNlcihtZXNzYWdlLCBoYW5kbGVyKTtcbiAgICAgIGF3YWl0IG9uY2UodG9rZW5TdHJlYW1QYXJzZXIsICdlbmQnKTtcblxuICAgICAgaWYgKGhhbmRsZXIubG9naW5BY2tSZWNlaXZlZCkge1xuICAgICAgICByZXR1cm4gaGFuZGxlci5yb3V0aW5nRGF0YTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5sb2dpbkVycm9yKSB7XG4gICAgICAgIHRocm93IHRoaXMubG9naW5FcnJvcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBDb25uZWN0aW9uRXJyb3IoJ0xvZ2luIGZhaWxlZC4nLCAnRUxPR0lOJyk7XG4gICAgICB9XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMubG9naW5FcnJvciA9IHVuZGVmaW5lZDtcbiAgICAgIHNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIG9uQWJvcnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgYXN5bmMgcGVyZm9ybVNlbnRMb2dpbjdXaXRoTlRMTUxvZ2luKHNpZ25hbDogQWJvcnRTaWduYWwpOiBQcm9taXNlPFJvdXRpbmdEYXRhIHwgdW5kZWZpbmVkPiB7XG4gICAgc2lnbmFsLnRocm93SWZBYm9ydGVkKCk7XG5cbiAgICBjb25zdCB7IHByb21pc2U6IHNpZ25hbEFib3J0ZWQsIHJlamVjdCB9ID0gd2l0aFJlc29sdmVyczxuZXZlcj4oKTtcblxuICAgIGNvbnN0IG9uQWJvcnQgPSAoKSA9PiB7IHJlamVjdChzaWduYWwucmVhc29uKTsgfTtcbiAgICBzaWduYWwuYWRkRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBvbkFib3J0LCB7IG9uY2U6IHRydWUgfSk7XG5cbiAgICB0cnkge1xuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IGF3YWl0IFByb21pc2UucmFjZShbXG4gICAgICAgICAgdGhpcy5tZXNzYWdlSW8ucmVhZE1lc3NhZ2UoKS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICB0aHJvdyB0aGlzLndyYXBTb2NrZXRFcnJvcihlcnIpO1xuICAgICAgICAgIH0pLFxuICAgICAgICAgIHNpZ25hbEFib3J0ZWRcbiAgICAgICAgXSk7XG5cbiAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBMb2dpbjdUb2tlbkhhbmRsZXIodGhpcyk7XG4gICAgICAgIGNvbnN0IHRva2VuU3RyZWFtUGFyc2VyID0gdGhpcy5jcmVhdGVUb2tlblN0cmVhbVBhcnNlcihtZXNzYWdlLCBoYW5kbGVyKTtcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5yYWNlKFtcbiAgICAgICAgICBvbmNlKHRva2VuU3RyZWFtUGFyc2VyLCAnZW5kJyksXG4gICAgICAgICAgc2lnbmFsQWJvcnRlZFxuICAgICAgICBdKTtcblxuICAgICAgICBpZiAoaGFuZGxlci5sb2dpbkFja1JlY2VpdmVkKSB7XG4gICAgICAgICAgcmV0dXJuIGhhbmRsZXIucm91dGluZ0RhdGE7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5udGxtcGFja2V0KSB7XG4gICAgICAgICAgY29uc3QgYXV0aGVudGljYXRpb24gPSB0aGlzLmNvbmZpZy5hdXRoZW50aWNhdGlvbiBhcyBOdGxtQXV0aGVudGljYXRpb247XG5cbiAgICAgICAgICBjb25zdCBwYXlsb2FkID0gbmV3IE5UTE1SZXNwb25zZVBheWxvYWQoe1xuICAgICAgICAgICAgZG9tYWluOiBhdXRoZW50aWNhdGlvbi5vcHRpb25zLmRvbWFpbixcbiAgICAgICAgICAgIHVzZXJOYW1lOiBhdXRoZW50aWNhdGlvbi5vcHRpb25zLnVzZXJOYW1lLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IGF1dGhlbnRpY2F0aW9uLm9wdGlvbnMucGFzc3dvcmQsXG4gICAgICAgICAgICBudGxtcGFja2V0OiB0aGlzLm50bG1wYWNrZXRcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHRoaXMubWVzc2FnZUlvLnNlbmRNZXNzYWdlKFRZUEUuTlRMTUFVVEhfUEtULCBwYXlsb2FkLmRhdGEpO1xuICAgICAgICAgIHRoaXMuZGVidWcucGF5bG9hZChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXlsb2FkLnRvU3RyaW5nKCcgICcpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdGhpcy5udGxtcGFja2V0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMubG9naW5FcnJvcikge1xuICAgICAgICAgIHRocm93IHRoaXMubG9naW5FcnJvcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgQ29ubmVjdGlvbkVycm9yKCdMb2dpbiBmYWlsZWQuJywgJ0VMT0dJTicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMubG9naW5FcnJvciA9IHVuZGVmaW5lZDtcbiAgICAgIHNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIG9uQWJvcnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgYXN5bmMgcGVyZm9ybVNlbnRMb2dpbjdXaXRoRmVkQXV0aChzaWduYWw6IEFib3J0U2lnbmFsKTogUHJvbWlzZTxSb3V0aW5nRGF0YSB8IHVuZGVmaW5lZD4ge1xuICAgIHNpZ25hbC50aHJvd0lmQWJvcnRlZCgpO1xuXG4gICAgY29uc3QgeyBwcm9taXNlOiBzaWduYWxBYm9ydGVkLCByZWplY3QgfSA9IHdpdGhSZXNvbHZlcnM8bmV2ZXI+KCk7XG5cbiAgICBjb25zdCBvbkFib3J0ID0gKCkgPT4geyByZWplY3Qoc2lnbmFsLnJlYXNvbik7IH07XG4gICAgc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb25BYm9ydCwgeyBvbmNlOiB0cnVlIH0pO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBhd2FpdCBQcm9taXNlLnJhY2UoW1xuICAgICAgICB0aGlzLm1lc3NhZ2VJby5yZWFkTWVzc2FnZSgpLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICB0aHJvdyB0aGlzLndyYXBTb2NrZXRFcnJvcihlcnIpO1xuICAgICAgICB9KSxcbiAgICAgICAgc2lnbmFsQWJvcnRlZFxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgTG9naW43VG9rZW5IYW5kbGVyKHRoaXMpO1xuICAgICAgY29uc3QgdG9rZW5TdHJlYW1QYXJzZXIgPSB0aGlzLmNyZWF0ZVRva2VuU3RyZWFtUGFyc2VyKG1lc3NhZ2UsIGhhbmRsZXIpO1xuICAgICAgYXdhaXQgUHJvbWlzZS5yYWNlKFtcbiAgICAgICAgb25jZSh0b2tlblN0cmVhbVBhcnNlciwgJ2VuZCcpLFxuICAgICAgICBzaWduYWxBYm9ydGVkXG4gICAgICBdKTtcblxuICAgICAgaWYgKGhhbmRsZXIubG9naW5BY2tSZWNlaXZlZCkge1xuICAgICAgICByZXR1cm4gaGFuZGxlci5yb3V0aW5nRGF0YTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZmVkQXV0aEluZm9Ub2tlbiA9IGhhbmRsZXIuZmVkQXV0aEluZm9Ub2tlbjtcblxuICAgICAgaWYgKGZlZEF1dGhJbmZvVG9rZW4gJiYgZmVkQXV0aEluZm9Ub2tlbi5zdHN1cmwgJiYgZmVkQXV0aEluZm9Ub2tlbi5zcG4pIHtcbiAgICAgICAgLyoqIEZlZGVyYXRlZCBhdXRoZW50aWNhdGlvbiBjb25maWdhdGlvbi4gKi9cbiAgICAgICAgY29uc3QgYXV0aGVudGljYXRpb24gPSB0aGlzLmNvbmZpZy5hdXRoZW50aWNhdGlvbiBhcyBUb2tlbkNyZWRlbnRpYWxBdXRoZW50aWNhdGlvbiB8IEF6dXJlQWN0aXZlRGlyZWN0b3J5UGFzc3dvcmRBdXRoZW50aWNhdGlvbiB8IEF6dXJlQWN0aXZlRGlyZWN0b3J5TXNpVm1BdXRoZW50aWNhdGlvbiB8IEF6dXJlQWN0aXZlRGlyZWN0b3J5TXNpQXBwU2VydmljZUF1dGhlbnRpY2F0aW9uIHwgQXp1cmVBY3RpdmVEaXJlY3RvcnlTZXJ2aWNlUHJpbmNpcGFsU2VjcmV0IHwgQXp1cmVBY3RpdmVEaXJlY3RvcnlEZWZhdWx0QXV0aGVudGljYXRpb247XG4gICAgICAgIC8qKiBQZXJtaXNzaW9uIHNjb3BlIHRvIHBhc3MgdG8gRW50cmEgSUQgd2hlbiByZXF1ZXN0aW5nIGFuIGF1dGhlbnRpY2F0aW9uIHRva2VuLiAqL1xuICAgICAgICBjb25zdCB0b2tlblNjb3BlID0gbmV3IFVSTCgnLy5kZWZhdWx0JywgZmVkQXV0aEluZm9Ub2tlbi5zcG4pLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgLyoqIEluc3RhbmNlIG9mIHRoZSB0b2tlbiBjcmVkZW50aWFsIHRvIHVzZSB0byBhdXRoZW50aWNhdGUgdG8gdGhlIHJlc291cmNlLiAqL1xuICAgICAgICBsZXQgY3JlZGVudGlhbHM6IFRva2VuQ3JlZGVudGlhbDtcblxuICAgICAgICBzd2l0Y2ggKGF1dGhlbnRpY2F0aW9uLnR5cGUpIHtcbiAgICAgICAgICBjYXNlICd0b2tlbi1jcmVkZW50aWFsJzpcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzID0gYXV0aGVudGljYXRpb24ub3B0aW9ucy5jcmVkZW50aWFsO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnYXp1cmUtYWN0aXZlLWRpcmVjdG9yeS1wYXNzd29yZCc6XG4gICAgICAgICAgICBjcmVkZW50aWFscyA9IG5ldyBVc2VybmFtZVBhc3N3b3JkQ3JlZGVudGlhbChcbiAgICAgICAgICAgICAgYXV0aGVudGljYXRpb24ub3B0aW9ucy50ZW5hbnRJZCA/PyAnY29tbW9uJyxcbiAgICAgICAgICAgICAgYXV0aGVudGljYXRpb24ub3B0aW9ucy5jbGllbnRJZCxcbiAgICAgICAgICAgICAgYXV0aGVudGljYXRpb24ub3B0aW9ucy51c2VyTmFtZSxcbiAgICAgICAgICAgICAgYXV0aGVudGljYXRpb24ub3B0aW9ucy5wYXNzd29yZFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2F6dXJlLWFjdGl2ZS1kaXJlY3RvcnktbXNpLXZtJzpcbiAgICAgICAgICBjYXNlICdhenVyZS1hY3RpdmUtZGlyZWN0b3J5LW1zaS1hcHAtc2VydmljZSc6XG4gICAgICAgICAgICBjb25zdCBtc2lBcmdzID0gYXV0aGVudGljYXRpb24ub3B0aW9ucy5jbGllbnRJZCA/IFthdXRoZW50aWNhdGlvbi5vcHRpb25zLmNsaWVudElkLCB7fV0gOiBbe31dO1xuICAgICAgICAgICAgY3JlZGVudGlhbHMgPSBuZXcgTWFuYWdlZElkZW50aXR5Q3JlZGVudGlhbCguLi5tc2lBcmdzKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2F6dXJlLWFjdGl2ZS1kaXJlY3RvcnktZGVmYXVsdCc6XG4gICAgICAgICAgICBjb25zdCBhcmdzID0gYXV0aGVudGljYXRpb24ub3B0aW9ucy5jbGllbnRJZCA/IHsgbWFuYWdlZElkZW50aXR5Q2xpZW50SWQ6IGF1dGhlbnRpY2F0aW9uLm9wdGlvbnMuY2xpZW50SWQgfSA6IHt9O1xuICAgICAgICAgICAgY3JlZGVudGlhbHMgPSBuZXcgRGVmYXVsdEF6dXJlQ3JlZGVudGlhbChhcmdzKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2F6dXJlLWFjdGl2ZS1kaXJlY3Rvcnktc2VydmljZS1wcmluY2lwYWwtc2VjcmV0JzpcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzID0gbmV3IENsaWVudFNlY3JldENyZWRlbnRpYWwoXG4gICAgICAgICAgICAgIGF1dGhlbnRpY2F0aW9uLm9wdGlvbnMudGVuYW50SWQsXG4gICAgICAgICAgICAgIGF1dGhlbnRpY2F0aW9uLm9wdGlvbnMuY2xpZW50SWQsXG4gICAgICAgICAgICAgIGF1dGhlbnRpY2F0aW9uLm9wdGlvbnMuY2xpZW50U2VjcmV0XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICAvKiogQWNjZXNzIHRva2VuIHJldHJpZXZlZCBmcm9tIEVudHJhIElEIGZvciB0aGUgY29uZmlndXJlZCBwZXJtaXNzaW9uIHNjb3BlKHMpLiAqL1xuICAgICAgICBsZXQgdG9rZW5SZXNwb25zZTogQWNjZXNzVG9rZW4gfCBudWxsO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdG9rZW5SZXNwb25zZSA9IGF3YWl0IFByb21pc2UucmFjZShbXG4gICAgICAgICAgICBjcmVkZW50aWFscy5nZXRUb2tlbih0b2tlblNjb3BlKSxcbiAgICAgICAgICAgIHNpZ25hbEFib3J0ZWRcbiAgICAgICAgICBdKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgc2lnbmFsLnRocm93SWZBYm9ydGVkKCk7XG5cbiAgICAgICAgICB0aHJvdyBuZXcgQWdncmVnYXRlRXJyb3IoXG4gICAgICAgICAgICBbbmV3IENvbm5lY3Rpb25FcnJvcignU2VjdXJpdHkgdG9rZW4gY291bGQgbm90IGJlIGF1dGhlbnRpY2F0ZWQgb3IgYXV0aG9yaXplZC4nLCAnRUZFREFVVEgnKSwgZXJyXSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUeXBlIGd1YXJkIHRoZSB0b2tlbiB2YWx1ZSBzbyB0aGF0IGl0IGlzIG5ldmVyIG51bGwuXG4gICAgICAgIGlmICh0b2tlblJlc3BvbnNlID09PSBudWxsKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEFnZ3JlZ2F0ZUVycm9yKFxuICAgICAgICAgICAgW25ldyBDb25uZWN0aW9uRXJyb3IoJ1NlY3VyaXR5IHRva2VuIGNvdWxkIG5vdCBiZSBhdXRoZW50aWNhdGVkIG9yIGF1dGhvcml6ZWQuJywgJ0VGRURBVVRIJyldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2VuZEZlZEF1dGhUb2tlbk1lc3NhZ2UodG9rZW5SZXNwb25zZS50b2tlbik7XG4gICAgICAgIC8vIHNlbnQgdGhlIGZlZEF1dGggdG9rZW4gbWVzc2FnZSwgdGhlIHJlc3QgaXMgc2ltaWxhciB0byBzdGFuZGFyZCBsb2dpbiA3XG4gICAgICAgIHRoaXMudHJhbnNpdGlvblRvKHRoaXMuU1RBVEUuU0VOVF9MT0dJTjdfV0lUSF9TVEFOREFSRF9MT0dJTik7XG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnBlcmZvcm1TZW50TG9naW43V2l0aFN0YW5kYXJkTG9naW4oc2lnbmFsKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5sb2dpbkVycm9yKSB7XG4gICAgICAgIHRocm93IHRoaXMubG9naW5FcnJvcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBDb25uZWN0aW9uRXJyb3IoJ0xvZ2luIGZhaWxlZC4nLCAnRUxPR0lOJyk7XG4gICAgICB9XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMubG9naW5FcnJvciA9IHVuZGVmaW5lZDtcbiAgICAgIHNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIG9uQWJvcnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgYXN5bmMgcGVyZm9ybUxvZ2dlZEluU2VuZGluZ0luaXRpYWxTcWwoc2lnbmFsOiBBYm9ydFNpZ25hbCkge1xuICAgIHNpZ25hbC50aHJvd0lmQWJvcnRlZCgpO1xuXG4gICAgY29uc3QgeyBwcm9taXNlOiBzaWduYWxBYm9ydGVkLCByZWplY3QgfSA9IHdpdGhSZXNvbHZlcnM8bmV2ZXI+KCk7XG5cbiAgICBjb25zdCBvbkFib3J0ID0gKCkgPT4geyByZWplY3Qoc2lnbmFsLnJlYXNvbik7IH07XG4gICAgc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb25BYm9ydCwgeyBvbmNlOiB0cnVlIH0pO1xuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuc2VuZEluaXRpYWxTcWwoKTtcblxuICAgICAgY29uc3QgbWVzc2FnZSA9IGF3YWl0IFByb21pc2UucmFjZShbXG4gICAgICAgIHRoaXMubWVzc2FnZUlvLnJlYWRNZXNzYWdlKCkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgIHRocm93IHRoaXMud3JhcFNvY2tldEVycm9yKGVycik7XG4gICAgICAgIH0pLFxuICAgICAgICBzaWduYWxBYm9ydGVkXG4gICAgICBdKTtcblxuICAgICAgY29uc3QgdG9rZW5TdHJlYW1QYXJzZXIgPSB0aGlzLmNyZWF0ZVRva2VuU3RyZWFtUGFyc2VyKG1lc3NhZ2UsIG5ldyBJbml0aWFsU3FsVG9rZW5IYW5kbGVyKHRoaXMpKTtcbiAgICAgIGF3YWl0IFByb21pc2UucmFjZShbXG4gICAgICAgIG9uY2UodG9rZW5TdHJlYW1QYXJzZXIsICdlbmQnKSxcbiAgICAgICAgc2lnbmFsQWJvcnRlZFxuICAgICAgXSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIG9uQWJvcnQpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBpc1RyYW5zaWVudEVycm9yKGVycm9yOiBBZ2dyZWdhdGVFcnJvciB8IENvbm5lY3Rpb25FcnJvcik6IGJvb2xlYW4ge1xuICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBBZ2dyZWdhdGVFcnJvcikge1xuICAgIGVycm9yID0gZXJyb3IuZXJyb3JzWzBdO1xuICB9XG4gIHJldHVybiAoZXJyb3IgaW5zdGFuY2VvZiBDb25uZWN0aW9uRXJyb3IpICYmICEhZXJyb3IuaXNUcmFuc2llbnQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbm5lY3Rpb247XG5tb2R1bGUuZXhwb3J0cyA9IENvbm5lY3Rpb247XG5cbkNvbm5lY3Rpb24ucHJvdG90eXBlLlNUQVRFID0ge1xuICBJTklUSUFMSVpFRDoge1xuICAgIG5hbWU6ICdJbml0aWFsaXplZCcsXG4gICAgZXZlbnRzOiB7fVxuICB9LFxuICBDT05ORUNUSU5HOiB7XG4gICAgbmFtZTogJ0Nvbm5lY3RpbmcnLFxuICAgIGV2ZW50czoge31cbiAgfSxcbiAgU0VOVF9QUkVMT0dJTjoge1xuICAgIG5hbWU6ICdTZW50UHJlbG9naW4nLFxuICAgIGV2ZW50czoge31cbiAgfSxcbiAgUkVST1VUSU5HOiB7XG4gICAgbmFtZTogJ1JlUm91dGluZycsXG4gICAgZXZlbnRzOiB7fVxuICB9LFxuICBUUkFOU0lFTlRfRkFJTFVSRV9SRVRSWToge1xuICAgIG5hbWU6ICdUUkFOU0lFTlRfRkFJTFVSRV9SRVRSWScsXG4gICAgZXZlbnRzOiB7fVxuICB9LFxuICBTRU5UX1RMU1NTTE5FR09USUFUSU9OOiB7XG4gICAgbmFtZTogJ1NlbnRUTFNTU0xOZWdvdGlhdGlvbicsXG4gICAgZXZlbnRzOiB7fVxuICB9LFxuICBTRU5UX0xPR0lON19XSVRIX1NUQU5EQVJEX0xPR0lOOiB7XG4gICAgbmFtZTogJ1NlbnRMb2dpbjdXaXRoU3RhbmRhcmRMb2dpbicsXG4gICAgZXZlbnRzOiB7fVxuICB9LFxuICBTRU5UX0xPR0lON19XSVRIX05UTE06IHtcbiAgICBuYW1lOiAnU2VudExvZ2luN1dpdGhOVExNTG9naW4nLFxuICAgIGV2ZW50czoge31cbiAgfSxcbiAgU0VOVF9MT0dJTjdfV0lUSF9GRURBVVRIOiB7XG4gICAgbmFtZTogJ1NlbnRMb2dpbjdXaXRoRmVkYXV0aCcsXG4gICAgZXZlbnRzOiB7fVxuICB9LFxuICBMT0dHRURfSU5fU0VORElOR19JTklUSUFMX1NRTDoge1xuICAgIG5hbWU6ICdMb2dnZWRJblNlbmRpbmdJbml0aWFsU3FsJyxcbiAgICBldmVudHM6IHt9XG4gIH0sXG4gIExPR0dFRF9JTjoge1xuICAgIG5hbWU6ICdMb2dnZWRJbicsXG4gICAgZXZlbnRzOiB7XG4gICAgICBzb2NrZXRFcnJvcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMudHJhbnNpdGlvblRvKHRoaXMuU1RBVEUuRklOQUwpO1xuICAgICAgICB0aGlzLmNsZWFudXBDb25uZWN0aW9uKCk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBTRU5UX0NMSUVOVF9SRVFVRVNUOiB7XG4gICAgbmFtZTogJ1NlbnRDbGllbnRSZXF1ZXN0JyxcbiAgICBlbnRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgICBsZXQgbWVzc2FnZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBtZXNzYWdlID0gYXdhaXQgdGhpcy5tZXNzYWdlSW8ucmVhZE1lc3NhZ2UoKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ3NvY2tldEVycm9yJywgZXJyKTtcbiAgICAgICAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCB0aGlzLndyYXBTb2NrZXRFcnJvcihlcnIpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmVxdWVzdCB0aW1lciBpcyBzdG9wcGVkIG9uIGZpcnN0IGRhdGEgcGFja2FnZVxuICAgICAgICB0aGlzLmNsZWFyUmVxdWVzdFRpbWVyKCk7XG5cbiAgICAgICAgY29uc3QgdG9rZW5TdHJlYW1QYXJzZXIgPSB0aGlzLmNyZWF0ZVRva2VuU3RyZWFtUGFyc2VyKG1lc3NhZ2UsIG5ldyBSZXF1ZXN0VG9rZW5IYW5kbGVyKHRoaXMsIHRoaXMucmVxdWVzdCEpKTtcblxuICAgICAgICAvLyBJZiB0aGUgcmVxdWVzdCB3YXMgY2FuY2VsZWQgYWZ0ZXIgdGhlIHJlcXVlc3QgbWVzc2FnZSB3YXNcbiAgICAgICAgLy8gZnVsbHkgc2VudCBvZmYsIGFuIGF0dGVudGlvbiBtZXNzYWdlIHdhcyBzZW50IHRvIHRoZSBzZXJ2ZXIuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIFdlIGFscmVhZHkgc3RhcnRlZCBjb25zdW1pbmcgdGhlIGN1cnJlbnQgbWVzc2FnZSAodGhlIHJlc3BvbnNlXG4gICAgICAgIC8vIHRvIHRoZSBjYW5jZWxlZCByZXF1ZXN0LCB3aXRoIGFsbCB0aGUgdG9rZW4gaGFuZGxlcnMgYmVpbmdcbiAgICAgICAgLy8gbm8tb3BzKSwgYW5kIG5lZWQgdG8gZW5zdXJlIHRoZSBuZXh0IG1lc3NhZ2UgKGNvbnRhaW5pbmcgdGhlXG4gICAgICAgIC8vIGF0dGVudGlvbiBhY2tub3dsZWRnZW1lbnQpIGlzIGhhbmRsZWQgYnkgdGhlIGBTRU5UX0FUVEVOVElPTmBcbiAgICAgICAgLy8gc3RhdGUuXG4gICAgICAgIGlmICh0aGlzLnJlcXVlc3Q/LmNhbmNlbGVkICYmIHRoaXMuYXR0ZW50aW9uU2VudCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnRyYW5zaXRpb25Ubyh0aGlzLlNUQVRFLlNFTlRfQVRURU5USU9OKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG9uUmVzdW1lID0gKCkgPT4ge1xuICAgICAgICAgIHRva2VuU3RyZWFtUGFyc2VyLnJlc3VtZSgpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBvblBhdXNlID0gKCkgPT4ge1xuICAgICAgICAgIHRva2VuU3RyZWFtUGFyc2VyLnBhdXNlKCk7XG5cbiAgICAgICAgICB0aGlzLnJlcXVlc3Q/Lm9uY2UoJ3Jlc3VtZScsIG9uUmVzdW1lKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnJlcXVlc3Q/Lm9uKCdwYXVzZScsIG9uUGF1c2UpO1xuXG4gICAgICAgIGlmICh0aGlzLnJlcXVlc3QgaW5zdGFuY2VvZiBSZXF1ZXN0ICYmIHRoaXMucmVxdWVzdC5wYXVzZWQpIHtcbiAgICAgICAgICBvblBhdXNlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBvbkNhbmNlbCA9ICgpID0+IHtcbiAgICAgICAgICAvLyBJZiB0aGUgcmVxdWVzdCB3YXMgY2FuY2VsZWQgYmVmb3JlIHRoZSByZXF1ZXN0IG1lc3NhZ2Ugd2FzXG4gICAgICAgICAgLy8gZnVsbHkgc2VudCwgdGhlIG1lc3NhZ2Ugd2FzIHRlcm1pbmF0ZWQgd2l0aCB0aGUgYElHTk9SRWAgYml0XG4gICAgICAgICAgLy8gc2V0IGFuZCBubyBhdHRlbnRpb24gbWVzc2FnZSB3YXMgc2VudC4gVGhlIHNlcnZlcidzIHJlc3BvbnNlXG4gICAgICAgICAgLy8gdG8gdGhlIGlnbm9yZWQgbWVzc2FnZSBpcyBoYW5kbGVkIGxpa2UgYSByZWd1bGFyIHJlc3BvbnNlLlxuICAgICAgICAgIGlmICghdGhpcy5hdHRlbnRpb25TZW50KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdG9rZW5TdHJlYW1QYXJzZXIucmVtb3ZlTGlzdGVuZXIoJ2VuZCcsIG9uRW5kT2ZNZXNzYWdlKTtcblxuICAgICAgICAgIGlmICh0aGlzLnJlcXVlc3QgaW5zdGFuY2VvZiBSZXF1ZXN0ICYmIHRoaXMucmVxdWVzdC5wYXVzZWQpIHtcbiAgICAgICAgICAgIC8vIHJlc3VtZSB0aGUgcmVxdWVzdCBpZiBpdCB3YXMgcGF1c2VkIHNvIHdlIGNhbiByZWFkIHRoZSByZW1haW5pbmcgdG9rZW5zXG4gICAgICAgICAgICB0aGlzLnJlcXVlc3QucmVzdW1lKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5yZXF1ZXN0Py5yZW1vdmVMaXN0ZW5lcigncGF1c2UnLCBvblBhdXNlKTtcbiAgICAgICAgICB0aGlzLnJlcXVlc3Q/LnJlbW92ZUxpc3RlbmVyKCdyZXN1bWUnLCBvblJlc3VtZSk7XG5cbiAgICAgICAgICAvLyBUaGUgYF9jYW5jZWxBZnRlclJlcXVlc3RTZW50YCBjYWxsYmFjayB3aWxsIGhhdmUgc2VudCBhXG4gICAgICAgICAgLy8gYXR0ZW50aW9uIG1lc3NhZ2UsIHNvIG5vdyB3ZSBuZWVkIHRvIGFsc28gc3dpdGNoIHRvXG4gICAgICAgICAgLy8gdGhlIGBTRU5UX0FUVEVOVElPTmAgc3RhdGUgdG8gbWFrZSBzdXJlIHRoZSBhdHRlbnRpb24gYWNrXG4gICAgICAgICAgLy8gbWVzc2FnZSBpcyBwcm9jZXNzZWQgY29ycmVjdGx5LlxuICAgICAgICAgIHRoaXMudHJhbnNpdGlvblRvKHRoaXMuU1RBVEUuU0VOVF9BVFRFTlRJT04pO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IG9uRW5kT2ZNZXNzYWdlID0gKCkgPT4ge1xuICAgICAgICAgIHRoaXMucmVxdWVzdD8ucmVtb3ZlTGlzdGVuZXIoJ2NhbmNlbCcsIHRoaXMuX2NhbmNlbEFmdGVyUmVxdWVzdFNlbnQpO1xuICAgICAgICAgIHRoaXMucmVxdWVzdD8ucmVtb3ZlTGlzdGVuZXIoJ2NhbmNlbCcsIG9uQ2FuY2VsKTtcbiAgICAgICAgICB0aGlzLnJlcXVlc3Q/LnJlbW92ZUxpc3RlbmVyKCdwYXVzZScsIG9uUGF1c2UpO1xuICAgICAgICAgIHRoaXMucmVxdWVzdD8ucmVtb3ZlTGlzdGVuZXIoJ3Jlc3VtZScsIG9uUmVzdW1lKTtcblxuICAgICAgICAgIHRoaXMudHJhbnNpdGlvblRvKHRoaXMuU1RBVEUuTE9HR0VEX0lOKTtcbiAgICAgICAgICBjb25zdCBzcWxSZXF1ZXN0ID0gdGhpcy5yZXF1ZXN0IGFzIFJlcXVlc3Q7XG4gICAgICAgICAgdGhpcy5yZXF1ZXN0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGlmICh0aGlzLmNvbmZpZy5vcHRpb25zLnRkc1ZlcnNpb24gPCAnN18yJyAmJiBzcWxSZXF1ZXN0LmVycm9yICYmIHRoaXMuaXNTcWxCYXRjaCkge1xuICAgICAgICAgICAgdGhpcy5pblRyYW5zYWN0aW9uID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIHNxbFJlcXVlc3QuY2FsbGJhY2soc3FsUmVxdWVzdC5lcnJvciwgc3FsUmVxdWVzdC5yb3dDb3VudCwgc3FsUmVxdWVzdC5yb3dzKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0b2tlblN0cmVhbVBhcnNlci5vbmNlKCdlbmQnLCBvbkVuZE9mTWVzc2FnZSk7XG4gICAgICAgIHRoaXMucmVxdWVzdD8ub25jZSgnY2FuY2VsJywgb25DYW5jZWwpO1xuICAgICAgfSkoKTtcblxuICAgIH0sXG4gICAgZXhpdDogZnVuY3Rpb24obmV4dFN0YXRlKSB7XG4gICAgICB0aGlzLmNsZWFyUmVxdWVzdFRpbWVyKCk7XG4gICAgfSxcbiAgICBldmVudHM6IHtcbiAgICAgIHNvY2tldEVycm9yOiBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgY29uc3Qgc3FsUmVxdWVzdCA9IHRoaXMucmVxdWVzdCE7XG4gICAgICAgIHRoaXMucmVxdWVzdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy50cmFuc2l0aW9uVG8odGhpcy5TVEFURS5GSU5BTCk7XG4gICAgICAgIHRoaXMuY2xlYW51cENvbm5lY3Rpb24oKTtcblxuICAgICAgICBzcWxSZXF1ZXN0LmNhbGxiYWNrKGVycik7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBTRU5UX0FUVEVOVElPTjoge1xuICAgIG5hbWU6ICdTZW50QXR0ZW50aW9uJyxcbiAgICBlbnRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgICBsZXQgbWVzc2FnZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBtZXNzYWdlID0gYXdhaXQgdGhpcy5tZXNzYWdlSW8ucmVhZE1lc3NhZ2UoKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ3NvY2tldEVycm9yJywgZXJyKTtcbiAgICAgICAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCB0aGlzLndyYXBTb2NrZXRFcnJvcihlcnIpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IEF0dGVudGlvblRva2VuSGFuZGxlcih0aGlzLCB0aGlzLnJlcXVlc3QhKTtcbiAgICAgICAgY29uc3QgdG9rZW5TdHJlYW1QYXJzZXIgPSB0aGlzLmNyZWF0ZVRva2VuU3RyZWFtUGFyc2VyKG1lc3NhZ2UsIGhhbmRsZXIpO1xuXG4gICAgICAgIGF3YWl0IG9uY2UodG9rZW5TdHJlYW1QYXJzZXIsICdlbmQnKTtcbiAgICAgICAgLy8gMy4yLjUuNyBTZW50IEF0dGVudGlvbiBTdGF0ZVxuICAgICAgICAvLyBEaXNjYXJkIGFueSBkYXRhIGNvbnRhaW5lZCBpbiB0aGUgcmVzcG9uc2UsIHVudGlsIHdlIHJlY2VpdmUgdGhlIGF0dGVudGlvbiByZXNwb25zZVxuICAgICAgICBpZiAoaGFuZGxlci5hdHRlbnRpb25SZWNlaXZlZCkge1xuICAgICAgICAgIHRoaXMuYXR0ZW50aW9uU2VudCA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuY2xlYXJDYW5jZWxUaW1lcigpO1xuXG4gICAgICAgICAgY29uc3Qgc3FsUmVxdWVzdCA9IHRoaXMucmVxdWVzdCE7XG4gICAgICAgICAgdGhpcy5yZXF1ZXN0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHRoaXMudHJhbnNpdGlvblRvKHRoaXMuU1RBVEUuTE9HR0VEX0lOKTtcblxuICAgICAgICAgIGlmIChzcWxSZXF1ZXN0LmVycm9yICYmIHNxbFJlcXVlc3QuZXJyb3IgaW5zdGFuY2VvZiBSZXF1ZXN0RXJyb3IgJiYgc3FsUmVxdWVzdC5lcnJvci5jb2RlID09PSAnRVRJTUVPVVQnKSB7XG4gICAgICAgICAgICBzcWxSZXF1ZXN0LmNhbGxiYWNrKHNxbFJlcXVlc3QuZXJyb3IpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzcWxSZXF1ZXN0LmNhbGxiYWNrKG5ldyBSZXF1ZXN0RXJyb3IoJ0NhbmNlbGVkLicsICdFQ0FOQ0VMJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSkoKS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge1xuICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGV2ZW50czoge1xuICAgICAgc29ja2V0RXJyb3I6IGZ1bmN0aW9uKGVycikge1xuICAgICAgICBjb25zdCBzcWxSZXF1ZXN0ID0gdGhpcy5yZXF1ZXN0ITtcbiAgICAgICAgdGhpcy5yZXF1ZXN0ID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHRoaXMudHJhbnNpdGlvblRvKHRoaXMuU1RBVEUuRklOQUwpO1xuICAgICAgICB0aGlzLmNsZWFudXBDb25uZWN0aW9uKCk7XG5cbiAgICAgICAgc3FsUmVxdWVzdC5jYWxsYmFjayhlcnIpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgRklOQUw6IHtcbiAgICBuYW1lOiAnRmluYWwnLFxuICAgIGV2ZW50czoge31cbiAgfVxufTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBQUEsT0FBQSxHQUFBQyxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUMsR0FBQSxHQUFBRixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUUsR0FBQSxHQUFBQyx1QkFBQSxDQUFBSCxPQUFBO0FBQ0EsSUFBQUksR0FBQSxHQUFBRCx1QkFBQSxDQUFBSCxPQUFBO0FBQ0EsSUFBQUssSUFBQSxHQUFBTixzQkFBQSxDQUFBQyxPQUFBO0FBRUEsSUFBQU0sVUFBQSxHQUFBUCxzQkFBQSxDQUFBQyxPQUFBO0FBR0EsSUFBQU8sT0FBQSxHQUFBUCxPQUFBO0FBRUEsSUFBQVEsU0FBQSxHQUFBUixPQUFBO0FBTUEsSUFBQVMsU0FBQSxHQUFBVCxPQUFBO0FBRUEsSUFBQVUsU0FBQSxHQUFBWCxzQkFBQSxDQUFBQyxPQUFBO0FB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTUssVUFBVSxTQUFTQyxvQkFBWSxDQUFDO0VBQ3BDO0FBQ0Y7QUFDQTs7RUFFRTtBQUNGO0FBQ0E7O0VBRUU7QUFDRjtBQUNBOztFQUVFO0FBQ0Y7QUFDQTs7RUFFRTtBQUNGO0FBQ0E7O0VBRUU7QUFDRjtBQUNBOztFQUVFO0FBQ0Y7QUFDQTs7RUFFRTtBQUNGO0FBQ0E7O0VBRUU7QUFDRjtBQUNBOztFQUVFO0FBQ0Y7QUFDQTs7RUFFRTtBQUNGO0FBQ0E7O0VBRUU7QUFDRjtBQUNBOztFQUVFO0FBQ0Y7QUFDQTs7RUFFRTtBQUNGO0FBQ0E7O0VBR0U7QUFDRjtBQUNBOztFQWtCRTtBQUNGO0FBQ0E7O0VBR0U7QUFDRjtBQUNBOztFQUVFO0FBQ0Y7QUFDQTs7RUFFRTtBQUNGO0FBQ0E7O0VBR0U7QUFDRjtBQUNBOztFQUVFO0FBQ0Y7QUFDQTs7RUFFRTtBQUNGO0FBQ0E7O0VBRUU7QUFDRjtBQUNBOztFQUdFO0FBQ0Y7QUFDQTs7RUFFRTtBQUNGO0FBQ0E7O0VBR0U7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztFQUdFO0FBQ0Y7QUFDQTs7RUFHRTtBQUNGO0FBQ0E7O0VBR0U7QUFDRjtBQUNBOztFQUdFO0FBQ0Y7QUFDQTs7RUFHRTtBQUNGO0FBQ0E7O0VBR0U7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0VBQ0VDLFdBQVdBLENBQUNDLE1BQStCLEVBQUU7SUFDM0MsS0FBSyxDQUFDLENBQUM7SUFFUCxJQUFJLE9BQU9BLE1BQU0sS0FBSyxRQUFRLElBQUlBLE1BQU0sS0FBSyxJQUFJLEVBQUU7TUFDakQsTUFBTSxJQUFJQyxTQUFTLENBQUMsK0RBQStELENBQUM7SUFDdEY7SUFFQSxJQUFJLE9BQU9ELE1BQU0sQ0FBQ0UsTUFBTSxLQUFLLFFBQVEsRUFB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