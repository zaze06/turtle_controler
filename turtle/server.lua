local DataTypes = {}
local ClientTypes = {}
local RequestTypes = {}
local ServerTypes = {}

local programs = {
    [ClientTypes.storage] = 2,
    [ClientTypes.storage] = 1
}

local ws, error = http.websocket("ws://localhost:8081")

ws.send(textutils.serialiseJSON({type = "register", id = os.getComputerID(), program = "server", serverType = ServerTypes.deployServer}));
local pos = gps.locate()

local data, binary = ws.receive()

print(data)

data = textutils.unserializeJSON(data)

if data.type ~= DataTypes.message then
    error(textutils.serialiseJSON(data))
end

if data.message ~= "Success!" then
    error(textutils.serialiseJSON(data))
end

local function sortingFunction(a, b)
    if a.id == true and b.id == false then
        return true
    else
        return false
    end
end

local turtle_index = {}

function indexTurtles()
    turtle_index = {}
    for i = 1, 16, 1 do
        turtle.select(i)
        item = turtle.getItemDetail();
        if item ~= nil then
            if string.find(item.name, "computercraft:turtle") then
                if item.count == 1 then
                    if turtle.place() then
                        os.sleep(0.5)
                        p = peripheral.wrap("front")
                        if p.getID() == -1 then
                            table.insert(turtle_index, {id = false, amount = 1, slot = i})
                            turtle.dig()
                        else
                            table.insert(turtle_index, {id = true, amount = 1, slot = i})
                            turtle.dig()
                        end
                    end
                else
                    table.insert(turtle_index, {id = false, amount = item.count, slot = i})
                end
            end
        end
    end
    table.sort(turtle_index, sortingFunction)

    for i, v in ipairs(turtle_index) do
        print(v.id, v.amount, v.slot)
    end
end

local turtles = 0
function updateTurtles()
    turtles = 0
    for i = 1, 16, 1 do
        turtle.select(i)
        item = turtle.getItemDetail()
        if item ~= nil then
            if item.name == "computercraft:turtle_advanced" then
                turtles = turtles + item.count
            elseif item.name == "computercraft:turtle_normal" then
                turtles = turtles + item.count
            end
        end
    end
    print("Have " .. tostring(turtles) .. " turtles at disposal")
end

updateTurtles()
indexTurtles()

function findNonTurtleSlot()
    for i = 1, 16, 1 do
        turtle.select(i)
        item = turtle.getItemDetail()
        if item ~= nil then
            if item.name == "computercraft:turtle_advanced" then
            elseif item.name == "computercraft:turtle_normal" then
            elseif item.name == "minecraft:coal" then
            else
                return i
            end
        else
            return i
        end
    end
    return nil
end

function firstEmptySlot()
    for i = 1, 16, 1 do
        turtle.select(i)
        item = turtle.getItemDetail()
        if item == nil then
            return i
        end
    end
    return nil
end

function findItem(item)
    for i = 1, 16, 1 do
        itemDetail = turtle.getItemDetail(i)
        if itemDetail ~= nil then
            if itemDetail.name == item then
                return i
            end
        end
    end
    return nil
end

function testFule()
    if turtle.getFuleLevel() <= 20 then
        slot = findItem("minecraft:coal")
        if slot == nil then
            ws.send(textutils.serialiseJSON({type = DataTypes.request, item = "minecraft:coal", amount = 64, headless = true, pos = pos}))
        end
    end
end

while true do
    data, binary = ws.receive(3)

    if(data == nil) then
        if turtle.detectUp() then
            b, block = turtle.inspectUp()
            if not string.find(block.name, "computercraft:turtle") then
                turtle.turnLeft()
                p = peripheral.wrap("top")
                slot = turtle.getSelectedSlot()
                for i = 1, p.size(), 1 do
                    if slot > 16 then
                        slot = slot - 16;
                    end
                    turtle.select(slot)
                    turtle.suckUp()
                    item = turtle.getItemDetail();
                    if item ~= nil then
                        if item.name == "computercraft:turtle_advanced" then
                            slot = slot + 1
                            turtle.drop()
                        elseif item.name == "computercraft:turtle_normal" then
                            slot = slot + 1
                            turtle.drop()
                        elseif item.name == "minecraft:coal" then
                            slot = slot + 1
                            turtle.drop()
                        else
                            slot = slot + 1
                            turtle.dropDown()
                        end
                    end
                end
                turtle.turnRight()
            else
                print("emptying inventory to backup storage")
                turtle.turnLeft()
                for i = 1, 16, 1 do
                    turtle.select(i)
                    turtle.drop()
                end
                turtle.turnRight()
            end
            turtle.digUp()
            for i = 1, 16, 1 do
                turtle.select(i)
                item = turtle.getItemDetail();
                if item ~= nil then
                    if item.name == "computercraft:turtle_advanced" then
                    elseif item.name == "computercraft:turtle_normal" then
                    elseif item.name == "minecraft:coal" then
                    else
                        turtle.dropDown()
                    end
                end
            end
            turtle.turnLeft()
            p = peripheral.wrap("front")
            if firstEmptySlot() == nil then
                error("Full Inventory. big error!")
            end
            slot = turtle.getSelectedSlot()
            for i = 1, p.size(), 1 do
                turtle.select(slot)
                turtle.suck()
                item = turtle.getItemDetail();
                if item ~= nil then
                    if item.name == "computercraft:turtle_advanced" then
                        slot = slot + 1
                    elseif item.name == "computercraft:turtle_normal" then
                        slot = slot + 1
                    else
                        turtle.dropDown()
                    end
                end
            end
            turtle.turnRight()
            updateTurtles()
            indexTurtles()
        end
    else
        data = textutils.unserializeJSON(data)



        if data.type == DataTypes.deploy then
            if data.type == ClientTypes.mine then
                local i = 0
                if data.amout ~= nil then
                    i = data.amount
                end

                testFule()

                for j = 0, i, 1 do

                end
            end
        end
    end

end