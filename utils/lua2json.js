'use strict';
var assert = require('assert');

var luaParser = require('luaparse');

module.exports = function (lua) {
  return luaEval(luaParser.parse(lua));
};

function luaEval(ast, parentTable) {
  if (ast.type === 'Chunk') {
    var table = {};
    ast.body.forEach(function (chunk) {
      luaEval(chunk, table);
    });
    return table;
  } else if (ast.type === 'AssignmentStatement') {
    assert(parentTable, "Can't have an assignment statement without a place to put it");
    for (var ii = 0; ii < ast.variables.length; ++ii) {
      var varInfo = ast.variables[ii];
      if (varInfo.type !== 'Identifier') {
        console.log('Unknown variable type:', varInfo);
      }
      parentTable[varInfo.name] = luaEval(ast.init[ii]);
    }
    return parentTable;
  } else if (ast.type === 'TableConstructorExpression') {
    var table;
    if (ast.fields.length > 0 && ast.fields[0].type === 'TableValue') {
      table = [];
    } else {
      table = {};
    }
    ast.fields.forEach(function (chunk) {
      luaEval(chunk, table);
    });
    return table;
  } else if (ast.type === 'TableKey') {
    assert(parentTable, "Can't have a table key without a table to put it in");
    parentTable[luaEval(ast.key)] = luaEval(ast.value);
    return parentTable;
  } else if (ast.type === 'TableValue') {
    parentTable.push(luaEval(ast.value));
    return parentTable;
  } else if (/Literal$/.test(ast.type)) {
    return ast.value;
  } else {
    console.log('Unknown type:', ast);
  }
}

// var luaToJson = require('lua-to-json');
// var luaSrc = fs.readFileSync('/path/to/file.lua', 'utf8');
// var lua = luaToJson(luaSrc);
// console.log(JSON.stringify(lua, null, 2));
