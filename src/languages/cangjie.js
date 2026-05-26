/*
Language: Cangjie
Description: Cangjie is a general-purpose programming language developed by Huawei, featuring modern syntax with strong type inference, pattern matching, lambdas, and a hygienic macro system.
Author: Mashkov Sergey
Category: common, system
Website: https://cangjie-lang.cn/
*/

/** @type LanguageFn */
export default function(hljs) {
  const regex = hljs.regex;

  const KEYWORDS = {
    keyword: 'as break catch class const do else enum extend finally for foreign func|10 if import in init interface is let macro|10 match mut operator package|10 prop quote|10 return spawn static struct super this throw try type unsafe where while with inout main synchronized abstract internal open override private protected public redef sealed',
    type: 'Bool Float16 Float32 Float64 Int8 Int16 Int32 Int64 IntNative Nothing Rune This UInt8 UInt16 UInt32 UInt64 UIntNative Unit VArray Array Option String Range ArrayList HashMap HashSet Exception IllegalArgumentException OverflowException NoneValueException NegativeArraySizeException',
    built_in: 'println print hash toString compareTo equals',
    literal: 'true false'
  };

  const LINE_COMMENT = hljs.COMMENT('//', '$');

  const BLOCK_COMMENT = hljs.COMMENT('/\\*', '\\*/', { contains: [ 'self' ] });

  const STRING_ESCAPE = {
    scope: 'subst',
    match: /\\([\\abfnrtv"'\$0]|u\{[a-fA-F0-9]{1,8}\})/
  };

  const SUBST = {
    scope: 'subst',
    begin: /\$\{/,
    end: /\}/,
    contains: [ 'self' ]
  };

  const BASE_STRING_CONTAINS = [
    STRING_ESCAPE,
    SUBST
  ];

  const TRIPLE_DOUBLE_STRING = {
    scope: 'string',
    begin: /"""(?=[^"])/,
    end: /"""/,
    contains: BASE_STRING_CONTAINS
  };

  const TRIPLE_SINGLE_STRING = {
    scope: 'string',
    begin: /'''(?=[^'])/,
    end: /'''/,
    contains: BASE_STRING_CONTAINS
  };

  const DOUBLE_STRING = {
    scope: 'string',
    begin: /"/,
    end: /"/,
    illegal: /\n/,
    contains: BASE_STRING_CONTAINS
  };

  const SINGLE_STRING = {
    scope: 'string',
    begin: /'/,
    end: /'/,
    illegal: /\n/,
    contains: [ STRING_ESCAPE ]
  };

  const RAW_STRING = (delimiter) => ({
    scope: 'string',
    begin: regex.concat(delimiter, '"'),
    end: regex.concat('"', delimiter)
  });

  const RAW_SINGLE_STRING = (delimiter) => ({
    scope: 'string',
    begin: regex.concat(delimiter, "'"),
    end: regex.concat("'", delimiter)
  });

  const J_STRING = {
    scope: 'string',
    begin: /J"/,
    end: /"/,
    illegal: /\n/,
    contains: [ STRING_ESCAPE ]
  };

  const BYTE_LITERAL = {
    scope: 'string',
    begin: /b'/,
    end: /'/,
    illegal: /\n/,
    contains: [ STRING_ESCAPE ]
  };

  const RAW_RUNE = {
    scope: 'string',
    begin: /r'/,
    end: /'/,
    illegal: /\n/
  };

  const STRING = {
    scope: 'string',
    variants: [
      TRIPLE_DOUBLE_STRING,
      TRIPLE_SINGLE_STRING,
      RAW_STRING('###'),
      RAW_STRING('##'),
      RAW_STRING('#'),
      RAW_SINGLE_STRING('###'),
      RAW_SINGLE_STRING('##'),
      RAW_SINGLE_STRING('#'),
      DOUBLE_STRING,
      SINGLE_STRING,
      J_STRING,
      BYTE_LITERAL,
      RAW_RUNE
    ]
  };

  SUBST.contains.push(STRING, hljs.C_NUMBER_MODE);

  const NUMBER_SUFFIX = '(i8|i16|i32|i64|inative|u8|u16|u32|u64|unative|f16|f32|f64)?';

  const NUMBER = {
    scope: 'number',
    variants: [
      { match: regex.concat(/\b0x[0-9a-fA-F]+(?:_[0-9a-fA-F]+)*/, NUMBER_SUFFIX) },
      { match: regex.concat(/\b0b[01]+(?:_[01]+)*/, NUMBER_SUFFIX) },
      { match: /\b0o[0-7]+(?:_[0-7]+)*\b/ },
      { match: regex.concat(/\b\d[_\d]*\.\d[_\d]*([eE][+-]?\d[_\d]*)?/, NUMBER_SUFFIX) },
      { match: regex.concat(/\b\d[_\d]*[eE][+-]?\d[_\d]*/, NUMBER_SUFFIX) },
      { match: regex.concat(/\.\d+(?:_\d+)*([eE][+-]?\d+)?/, NUMBER_SUFFIX) },
      { match: regex.concat(/\b\d+/, NUMBER_SUFFIX) },
      { match: /\b\d[_\d]*\b/ }
    ]
  };

  const ANNOTATION_ARGS = {
    begin: /\[/,
    end: /\]/,
    contains: [
      STRING,
      NUMBER,
      { match: /[A-Za-z_][A-Za-z0-9_]*(?=:)/ },
      'self'
    ]
  };

  const ANNOTATION = {
    scope: 'meta',
    begin: /@[A-Za-z_][A-Za-z0-9_]*(?=\[)/,
    contains: [ ANNOTATION_ARGS ]
  };

  const ANNOTATION_SIMPLE = {
    scope: 'meta',
    match: /@[A-Za-z_][A-Za-z0-9_]*(?!\[)/
  };

  const ANNOTATION_BANG = {
    scope: 'meta',
    match: /@!/
  };

  const PACKAGE_KEYWORD = {
    match: /\bpackage\b/,
    scope: 'keyword'
  };

  const PACKAGE_NAME = {
    match: /[A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)*/,
    scope: 'title.namespace'
  };

  const PACKAGE_DECL = {
    begin: [
      /\b(?:public|protected|internal)?\s*/,
      PACKAGE_KEYWORD.match,
      /\s+/,
      PACKAGE_NAME.match
    ],
    beginScope: {
      2: 'keyword',
      4: 'title.namespace'
    },
    relevance: 10
  };

  const IMPORT_DECL = {
    begin: [
      /\b(?:public|private|protected|internal)?\s*/,
      /\bimport\b/,
      /\s+/
    ],
    beginScope: { 2: 'keyword' },
    contains: [
      {
        scope: 'title.namespace',
        match: /[A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)*/
      },
      {
        scope: 'operator',
        match: /\.\*/
      },
      {
        begin: /\{/,
        end: /\}/,
        contains: [
          {
            scope: 'title.function',
            match: /[a-z_][A-Za-z0-9_]*/
          },
          {
            scope: 'title.class',
            match: /[A-Z][A-Za-z0-9_]*/
          }
        ]
      },
      {
        match: /\bas\b/,
        scope: 'keyword'
      },
      'self'
    ]
  };

  const GENERIC_PARAMS = {
    begin: /</,
    end: />/,
    contains: [
      {
        match: /[A-Za-z_][A-Za-z0-9_]+/,
        scope: 'type'
      },
      {
        match: /,/,
        scope: 'punctuation'
      },
      {
        match: /\bwhere\b/,
        scope: 'keyword'
      },
      {
        match: /<:/,
        scope: 'operator'
      },
      'self'
    ]
  };

  const PARAM_LIST = {
    begin: /\(/,
    end: /\)/,
    contains: [
      {
        match: /[A-Za-z_][A-Za-z0-9_]*!?:/,
        scope: 'variable.parameter'
      },
      {
        match: /\b(?:var|let|public|private|protected|internal)\b/,
        scope: 'keyword'
      },
      {
        match: /:/,
        scope: 'punctuation'
      },
      'self'
    ]
  };

  const FUNCTION_DECL = {
    begin: [
      /\b(?:public|private|protected|internal|override|redef|mut|static|abstract|sealed|open)?\s*/,
      /\b(?:func|macro)\b/,
      /\s+/,
      /[A-Za-z_][A-Za-z0-9_]*/
    ],
    beginScope: {
      2: 'keyword',
      4: 'title.function'
    },
    relevance: 10,
    contains: [
      GENERIC_PARAMS,
      PARAM_LIST,
      {
        match: /:/,
        scope: 'punctuation'
      }
    ]
  };

  const CLASS_DECL = {
    begin: [
      /\b(?:public|private|protected|internal|sealed|open|abstract)?\s*/,
      /\b(?:class|struct|interface|enum|extend)\b/,
      /\s+/,
      /[A-Za-z_][A-Za-z0-9_]*/
    ],
    beginScope: {
      2: 'keyword',
      4: 'title.class'
    },
    contains: [
      {
        match: /<:/,
        scope: 'operator'
      },
      GENERIC_PARAMS,
      'self'
    ]
  };

  const PROP_DECL = {
    begin: [
      /\b(?:public|private|protected|internal|mut|static)?\s*/,
      /\bprop\b/,
      /\s+/,
      /[A-Za-z_][A-Za-z0-9_]*/
    ],
    beginScope: {
      2: 'keyword',
      4: 'property'
    }
  };

  const TYPE_DECL = {
    begin: [
      /\btype\b/,
      /\s+/,
      /[A-Za-z_][A-Za-z0-9_]*/
    ],
    beginScope: {
      1: 'keyword',
      3: 'title'
    }
  };

  const VAR_DECL = {
    begin: [
      /\b(?:public|private|protected|internal)?\s*/,
      /\b(?:let|var|const)\b/,
      /\s+/,
      /[A-Za-z_][A-Za-z0-9_]*/
    ],
    beginScope: {
      2: 'keyword',
      4: 'variable'
    }
  };

  const INIT_DECL = {
    begin: /~?init(?=\s*\()/,
    scope: 'keyword',
    contains: [ PARAM_LIST ]
  };

  const MACRO_PACKAGE_DECL = {
    begin: [
      /\b(?:public|private|protected|internal)?\s*/,
      /\bmacro\b/,
      /\s+/,
      /\bpackage\b/,
      /\s+/,
      /[A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)*/
    ],
    beginScope: {
      2: 'keyword',
      4: 'keyword',
      6: 'title.namespace'
    }
  };

  const MACRO_INTERP = {
    scope: 'subst',
    begin: /\$\(/,
    end: /\)/,
    contains: [
      STRING,
      NUMBER,
      {
        match: /[A-Za-z_][A-Za-z0-9_]+/,
        scope: 'variable'
      },
      'self'
    ]
  };

  const MACRO_VAR = {
    scope: 'variable',
    match: /\$[A-Za-z0-9_]+/
  };

  const QUOTE_ESCAPE = {
    scope: 'subst',
    match: /\\[\(\)\@\$]/
  };

  const QUOTE_EXPR = {
    begin: /\bquote\b/,
    beginScope: 'keyword',
    contains: [
      {
        begin: /\(/,
        end: /\)/,
        contains: [
          QUOTE_ESCAPE,
          MACRO_INTERP,
          MACRO_VAR,
          STRING,
          NUMBER,
          {
            match: /[A-Za-z_][A-Za-z0-9_]+/,
            scope: 'variable'
          },
          {
            match: /=>|->|[+\-*/%<>=!&|^~]|\?\?|\.\.|::/,
            scope: 'operator'
          },
          'self'
        ]
      }
    ]
  };

  const OPERATORS = {
    scope: 'operator',
    relevance: 0,
    match: /=>|->|<-|\|>|~>|<:|::|\+\+|--|\.\.\.|\.\.=|\.\.|\?\?|\?\[|\?\(|==|!=|<=|>=|&&|\|\||!|[+\-*/%]|<<|>>|&|\^|\||~|\?|<:/
  };

  const GENERIC_TYPE = {
    begin: /([A-Z][A-Za-z0-9_]*)</,
    beginScope: { 1: 'title.class' },
    end: />/,
    contains: [
      {
        match: /[A-Za-z_][A-Za-z0-9_]+/,
        scope: 'type'
      },
      'self'
    ]
  };

  const METHOD_CALL = {
    match: [
      /\./,
      /[A-Za-z_][A-Za-z0-9_]+/,
      /\(/,
    ],
    scope: {
      2: 'title.function'
    }
  };

  const MEMBER_ACCESS = {
    match: /\.([A-Za-z_][A-Za-z0-9_]*)(?!\()/,
    scope: 'property'
  };

  const SAFE_MEMBER_ACCESS = {
    match: /\?\./,
    scope: 'operator'
  };

  const CONTROL_FLOW = {
    match: /\b(?:if|else|while|do|for|match|case|where|try|catch|finally|throw|return|break|continue|synchronized|unsafe|handle|perform|resume)\b/,
    scope: 'keyword'
  };

  const FOREIGN_DECL = {
    begin: [
      /\bforeign\b/,
      /\s+/,
      /\bfunc\b/,
      /\s+/,
      /[A-Za-z_][A-Za-z0-9_]*/
    ],
    beginScope: {
      1: 'keyword',
      3: 'keyword',
      5: 'title.function'
    }
  };

  const FUNCTION_INVOKE = {
    scope: 'title.function.invoke',
    begin: regex.concat(
      /\b(?!(?:let|var|const|for|while|if|else|match|func|macro|class|struct|interface|enum|return|throw)\b)/,
      /[a-z_][A-Za-z0-9_]*(?=\s*\()/
    ),
    relevance: 0
  };

  const QUOTED_IDENTIFIER = {
    scope: 'variable',
    match: /`[A-Za-z_][A-Za-z0-9_]*`/
  };

  const TYPE_REFERENCE = {
    scope: 'type',
    match: /[A-Z][A-Za-z0-9_]*(?![A-Za-z0-9_])/
  };

  const VARIABLE = {
    scope: 'variable',
    match: /[a-z_][A-Za-z0-9_]*(?![A-Za-z0-9_])/
  };

  return {
    name: 'Cangjie',
    aliases: [ 'cj' ],
    keywords: KEYWORDS,
    illegal: /<\/|[A-Za-z][A-Za-z0-9_]*\s*=/,
    contains: [
      LINE_COMMENT,
      BLOCK_COMMENT,
      ANNOTATION,
      ANNOTATION_SIMPLE,
      ANNOTATION_BANG,
      PACKAGE_DECL,
      MACRO_PACKAGE_DECL,
      IMPORT_DECL,
      FUNCTION_DECL,
      CLASS_DECL,
      PROP_DECL,
      TYPE_DECL,
      VAR_DECL,
      INIT_DECL,
      FOREIGN_DECL,
      CONTROL_FLOW,
      QUOTE_EXPR,
      STRING,
      NUMBER,
      OPERATORS,
      GENERIC_TYPE,
      METHOD_CALL,
      MEMBER_ACCESS,
      SAFE_MEMBER_ACCESS,
      MACRO_INTERP,
      MACRO_VAR,
      QUOTED_IDENTIFIER,
      FUNCTION_INVOKE,
      TYPE_REFERENCE,
      VARIABLE,
      {
        match: /:/,
        scope: 'punctuation'
      },
      {
        match: /;/,
        scope: 'punctuation'
      },
      {
        match: /,/,
        scope: 'punctuation'
      },
      {
        begin: /\{/,
        end: /\}/,
        contains: [
          'self',
          LINE_COMMENT,
          BLOCK_COMMENT,
          STRING,
          NUMBER,
          CONTROL_FLOW,
          VAR_DECL,
          FUNCTION_DECL,
          CLASS_DECL,
          PROP_DECL,
          TYPE_DECL,
          INIT_DECL,
          FOREIGN_DECL,
          OPERATORS,
          METHOD_CALL,
          MEMBER_ACCESS,
          SAFE_MEMBER_ACCESS,
          FUNCTION_INVOKE,
          TYPE_REFERENCE,
          VARIABLE,
          ANNOTATION,
          ANNOTATION_SIMPLE,
          ANNOTATION_BANG
        ]
      }
    ]
  };
}