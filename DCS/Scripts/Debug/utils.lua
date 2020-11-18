-- utils.lua

local utils = {}

local function value2codeImpl(self, val)
  return string.format("return %s", self:value2string(val))
end

function utils:value2code(val)
  return value2codeImpl(self, val)
end

utils.value2code = value2codeImpl -- 将内部函数赋值给直接调用的形式

return utils
