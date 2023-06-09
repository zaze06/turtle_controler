---
--- Generated by Luanalysis
--- Created by tisudd22zaczel.
--- DateTime: 2023-04-20 19:49
---

local ws, error = http.websocket("ws://localhost:8081")

local name = os.getComputerLabel()

if name == nil then
    name = ""
end

ws.send(textutils.serialiseJSON({type = "register", id = os.getComputerID(), program = "client", programType = "ext", name = name}));
local data, binary = ws.receive()

print(data)

data = textutils.unserializeJSON(data)

if data.type == "name" then
    os.setComputerLabel(data.name)
end
