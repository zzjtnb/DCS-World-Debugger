module('me_chats', package.seeall)

local ucid = nil
local playerID = nil
local my_id = net.get_my_player_id()
local my_ucid = net.get_player_info(my_id, 'ucid')

function isAdmin()
  return ucid == my_ucid
end

function init(tab, player)
  ucid = player['ucid']
  playerID = player['id']
  if not playerID then
    return
  end
  if tab[1] == 'debug' and isAdmin() then
    debug(tab)
  end
  ucid = nil
  playerID = nil
end

function debug(tab)
  local status, error = pcall(function()
    local path = lfs.writedir() .. 'Scripts/Test/Main.lua'
    if not tab[2] then
      net.send_chat_to('请输入文件路径,默认执行Scripts/Test/Main.lua', playerID)
    else
      path = tab[2]
    end
    dofile(path)
  end)
  if (not status) then
    local result = string.format('脚本加载失败: %s', error)
    net.send_chat_to(result, playerID)
    net.log(result)
  else
    net.send_chat_to('脚本加载完成', playerID)
    net.log('脚本加载完成')
  end
end
