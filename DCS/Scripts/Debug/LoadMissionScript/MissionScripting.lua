-- Initialization script for the Mission lua Environment (SSE)
dofile('Scripts/ScriptingSystem.lua')

-----------------------------------任务环境脚本-----------------------------------

dofile(lfs.writedir() .. 'Scripts/Debug/Mission/Init.lua')

-----------------------------------清理任务脚本环境-----------------------------------

-- Sanitize Mission Scripting environment
-- This makes unavailable some unsecure functions.
-- Mission downloaded from server to client may contain potentialy harmful lua code that may use these functions.
-- You can remove the code below and make availble these functions at your own risk.
--[[

local function sanitizeModule(name)
  _G[name] = nil
  package.loaded[name] = nil
end

do
  sanitizeModule('os')
  sanitizeModule('io')
  sanitizeModule('lfs')
  _G['require'] = nil
  _G['loadlib'] = nil
  _G['package'] = nil
end

]]
