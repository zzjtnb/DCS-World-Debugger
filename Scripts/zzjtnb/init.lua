local loadVersion = 'version1.0'
dofile(lfs.writedir() .. 'Scripts/zzjtnb/' .. loadVersion .. '/zzjtnbUDP.lua')
dofile(lfs.writedir() .. 'Scripts/zzjtnb/' .. loadVersion .. '/zzjtnbTCP.lua')
dofile(lfs.writedir() .. 'Scripts/zzjtnb/' .. loadVersion .. '/common.lua')
dofile(lfs.writedir() .. 'Scripts/zzjtnb/' .. loadVersion .. '/zzjtnbDebuggerTCP.lua')
net.log('zzjtnbInit 全部加载完毕')
