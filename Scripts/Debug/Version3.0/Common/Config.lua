-- Load Luas
package.path = package.path .. ";./LuaSocket/?.lua"
package.path = package.path .. ";./Scripts/?.lua"
package.cpath = package.cpath .. ";./LuaSocket/?.dll"
TCP = TCP or {}
TCP.do_step = false
TCP.callbacks = {}
