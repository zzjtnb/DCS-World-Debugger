local base       = _G
local lfs        = base.require("lfs")

--- 获取文件信息
--- @class FileSystem
local FileSystem = {}

---@param filePath string 文件路径
---@return string directory 文件路径
---@return string fileName 文件名
---@return string fileExtension 文件后缀
---@usage
---     local directory, fileName, fileExtension = file.getInfo('/path/to/file.txt')
---     print(directory, fileName, fileExtension)
---     -- '/path/to' 'file.txt' 'txt'
function FileSystem.getInfo(filePath)
  -- 将文件路径中的分隔符替换为 /
  local normalizedPath = filePath:gsub("\\", "/")
  -- 匹配文件名和后缀
  local fileName, fileExtension = normalizedPath:match("(.+/)?(.+)%.([^.]+)$")
  if not fileName then
    -- 如果匹配失败,则文件可能没有后缀
    fileName = normalizedPath
    fileExtension = ""
  end
  -- 匹配路径中的文件夹
  local directory = normalizedPath:match("(.+)/")
  if not directory then
    directory = "."
  end
  return directory, fileName, fileExtension
end

--- 判断文件或文件夹是否存在
---@param path string 传入的路径
---@return boolean @存在返回true,不存在返回false
function FileSystem.exists(path)
  local attr = lfs.attributes(path)
  return attr and attr.mode
end

--- 判断是否为文件
---@param path string 传入文件的路径
---@return boolean @文件返回true,不是返回false
function FileSystem.isFile(path)
  local attr = lfs.attributes(path)
  return attr and attr.mode == "file"
end

--- 判断是否为文件夹
---@param path string 传入文件夹的路径
---@return boolean @文件夹返回true,不是返回false
function FileSystem.isDirectory(path)
  local attr = lfs.attributes(path)
  return attr and attr.mode == "directory"
end

--- 比较两个字符串的大小.
--- @param string1 string 要比较的第一个字符串.
--- @param string2 string 要比较的第二个字符串.
--- @return boolean @如果 string1 小于 string2,则返回 true,否则返回 false.
function FileSystem.compareStrings(string1, string2)
  return base.string.lower(string1) < base.string.lower(string2)
end

--- 获取文件夹和文件夹下的文件
---@param path string 文件夹路径
---@return table folders 文件夹
---@return table files 文件名
function FileSystem.getPathFoldersAndFiles(path)
  local files = {}
  local folders = {}
  for file in lfs.dir(path) do
    if '.' ~= file and '..' ~= file then
      local filePath = path .. '\\' .. file
      local attrib = lfs.attributes(filePath)
      if attrib then
        if 'file' == attrib.mode then
          base.table.insert(files, file)
        elseif 'directory' == attrib.mode then
          base.table.insert(folders, file)
        end
      end
    end
  end
  base.table.sort(files, FileSystem.compareStrings)
  base.table.sort(folders, FileSystem.compareStrings)
  return folders, files
end

--- 把路径分割成table,返回一个线性表(数组)
---@param path string @ E:\\Eagle Dynamics\\DCS World OpenBeta\\
---@return table @{[1]="E:",[2]="Eagle Dynamics",[3]="DCS World OpenBeta"
function FileSystem.splitPath(path)
  local result = {}
  for item in base.string.gmatch(path, "[^\\/]+") do
    base.table.insert(result, item)
  end
  return result
end

--- 从字符串 path 中移除字符串 rootPath 并返回结果
---@param path string '/home/user/documents'
---@param rootPath string '/home/user'
---@return string 'documents'
function FileSystem.cropRootPath(path, rootPath)
  local result = path
  if rootPath then
    local pos = base.string.find(path, rootPath)
    if pos then
      -- +1 用于 '/' 字符 , +1 用于 rootPath 后面的字符索引
      result = base.string.sub(path, base.string.len(rootPath) + 2)
    end
  end
  return result
end

return FileSystem
