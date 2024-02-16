Farm myFarm = [Name: "myFarm", Area: 1200, GridLength: 10, Polyculture: true, MaxWaterUsage: 1500, Season: "Summer"];

def isOkToPlant(c: Crop, f: Farm) -> Bool {
    Bool canPlant = false;
    if (c.getYield() > 3) and (c.getSeason() == f.getSeason()) {
        canPlant = true;
    }
    return canPlant;
}


for c in Crops {
    if isOkToPlant(c, myFarm) {
        myFarm.plantFarm(c, 8);
    }
}

myFarm.displayFarm();
