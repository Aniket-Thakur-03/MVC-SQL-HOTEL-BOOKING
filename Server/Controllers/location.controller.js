import path from "path";
import XLSX from "xlsx";
import sequelize from "../dbconnection.js";
import {ExtraService} from "../Models/extraservies.model.js";
import { Location } from "../Models/location.model.js";
import { Room } from "../Models/room.model.js";
const createLocationInDB = async (locationData, username, transaction = null) => {
  return await Location.create(
    {
      location_name: locationData.locationname,
      address: locationData.address,
      country: locationData.country,
      state: locationData.state,
      city: locationData.city,
      pincode: locationData.pincode,
      phoneno: locationData.phoneno,
      isActive: locationData.isActive,
      created_by: username,
      updated_by: username,
    },
    { transaction }
  );
};

export const createLocation = async (req, res) => {
  const { locationname, address, country, state, city, pincode, phoneno, isActive } = req.body;
  const { username } = req.user;

  if (req.file) {
    const transaction = await sequelize.transaction();
    try {
      const createdLocation = await createLocationInDB(
        { locationname, address, country, state, city, pincode, phoneno, isActive },
        username,
        transaction
      );

      // Read and parse the uploaded file
      const filePath = path.resolve(req.file.path);
      const workbook = XLSX.readFile(filePath);

      const roomsSheetName = workbook.SheetNames.find((name) => name.toLowerCase() === 'rooms');
      const servicesSheetName = workbook.SheetNames.find((name) => name.toLowerCase() === 'services');

      if (!roomsSheetName || !servicesSheetName) {
        throw new Error("The uploaded Excel file must have sheets named 'Rooms' and 'Services'.");
      }

      const roomsData = XLSX.utils.sheet_to_json(workbook.Sheets[roomsSheetName], { header: 1 });
      const servicesData = XLSX.utils.sheet_to_json(workbook.Sheets[servicesSheetName], { header: 1 });

      const expectedRoomHeaders = [
        "room_id",
        "roomtype_id",
        "retail_price",
        "selling_price",
        "meals_available",
        "veg_meals_price",
        "non_veg_meals_price",
        "no_of_rooms",
        "image_link_1",
        "image_link_2",
        "image_link_3",
        "image_link_4",
        "image_link_5",
        "image_link_6",
      ];

      const expectedServiceHeaders = ['service_id', 'service_name', 'service_price', 'gst_rate'];

      const roomsHeader = roomsData[0];
      const servicesHeader = servicesData[0];

      const arraysMatchInOrder = (arr1, arr2) =>
        arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);

      if (!roomsHeader || !arraysMatchInOrder(roomsHeader, expectedRoomHeaders)) {
        throw new Error(
          `Invalid headers in Rooms sheet. Expected order: ${expectedRoomHeaders.join(', ')}. Received order: ${roomsHeader.join(
            ', '
          )}.`
        );
      }

      if (!servicesHeader || !arraysMatchInOrder(servicesHeader, expectedServiceHeaders)) {
        throw new Error(
          `Invalid headers in Services sheet. Expected order: ${expectedServiceHeaders.join(', ')}. Received order: ${servicesHeader.join(
            ', '
          )}.`
        );
      }

      // Remove headers
      roomsData.shift();
      servicesData.shift();

      const rooms = roomsData.map((row) => ({
        roomtype_id: Number(row[1]),
        retail_price: Number(row[2]),
        selling_price: Number(row[3]),
        meals_available: row[4],
        veg_meals_price: Number(row[5]),
        non_veg_meals_price: Number(row[6]),
        no_of_rooms: Number(row[7]),
        image_link_1: row[8],
        image_link_2: row[9],
        image_link_3: row[10],
        image_link_4: row[11],
        image_link_5: row[12],
        image_link_6: row[13],
        location_id: createdLocation.location_id,
        created_by: username,
        updated_by: username,
      }));

      await Room.bulkCreate(rooms, { transaction });

      const services = servicesData.map((row) => ({
        service_name: row[1],
        service_price: Number(row[2]),
        gst_rate: Number(row[3]),
        location_id: createdLocation.location_id,
        created_by: username,
        updated_by: username,
      }));

      await ExtraService.bulkCreate(services, { transaction });

      // Commit transaction
      await transaction.commit();

      return res.status(200).json({ message: 'Location and data created successfully.' });
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      return res.status(400).json({ message: error.message });
    }
  } else {
    try {
      await createLocationInDB({ locationname, address, country, state, city, pincode, phoneno, isActive }, username);
      return res.status(200).json({ message: 'Location created successfully.' });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message });
    }
  }
};

export const getLocation = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const Locations = await Location.findByPk(id);
    if (!Locations) {
      return res.status(400).json({ message: "No location exist" });
    } else return res.status(200).json({ location: Locations });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getLocations = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const allLocations = await Location.findAll({
      where: { isActive: true },
      transaction: transaction,
    });
    if (allLocations.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: "No locations exist" });
    } else {
      const obj = await Promise.all(
        allLocations.map(async (location) => {
          const checkRoomAtLocation = await Room.findAll({
            where: { location_id: location.location_id, state: "active" },
            transaction: transaction,
          });
          if (checkRoomAtLocation.length === 0) {
            return null;
          } else {
            return {
              location_id: location.location_id,
              location_name: location.location_name,
              city: location.city,
              pincode: location.pincode,
            };
          }
        })
      );
      const obj1 = obj.filter((item) => item !== null);
      await transaction.commit();
      return res.status(200).json({ locations: obj1 });
    }
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
export const getLocationsAdmin = async (req, res) => {
  try {
    const allLocations = await Location.findAll();
    if (allLocations.length === 0) {
      return res.status(400).json({ message: "No locations exist" });
    } else return res.status(200).json({ locations: allLocations });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const editLocation = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const id = Number(req.params.id);
    const {
      locationname,
      address,
      country,
      state,
      city,
      pincode,
      phoneno,
      isActive,
    } = req.body;
    const { username } = req.user;
    const findLocation = await Location.findByPk(id, {
      transaction: transaction,
    });
    if (!findLocation) {
      await transaction.rollback();
      return res.status(400).json({ message: "Location dosen't exist" });
    }
    if (locationname) findLocation.location_name = locationname;
    if (address) findLocation.address = address;
    if (country) findLocation.country = country;
    if (state) findLocation.state = state;
    if (city) findLocation.city = city;
    if (pincode) findLocation.pincode = pincode;
    if (phoneno) findLocation.phoneno = phoneno;
    if (isActive) {
      const checkRoomAtLocation = await Room.findAll({
        where: { location_id: id },
        transaction: transaction,
      });
      if (checkRoomAtLocation.length > 0) {
        findLocation.isActive = isActive;
      } else {
        await transaction.rollback();
        return res.status(400).json({
          message: "Please add atleast one room before making location active",
        });
      }
    }
    if (!isActive) {
      findLocation.isActive = isActive;
      await Room.update(
        { state: "inactive", updated_by: username },
        { where: { location_id: id }, transaction: transaction }
      );
    }

    findLocation.updated_by = username;
    await findLocation.save({ transaction: transaction });
    await transaction.commit();
    return res.status(200).json({ message: "Location updated" });
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    return res.json({ message: error.message });
  }
};

export const locationDetails = async (req,res) => {
  const transaction = await sequelize.transaction();
  try {
    const id = Number(req.params.id);
    const roomdetails = await Room.findAll(
      {
        where:{location_id:id},
        attributes:{exclude:["state","created_at","updated_at","created_by","updated_by","location_id"]},
        raw:true,
        transaction:transaction,
    });
    const servicedetails = await ExtraService.findAll(
      {
        where:{location_id:id},
        attributes:{exclude:["isactive","created_at","updated_at","created_by","updated_by","location_id"]},
        raw:true,
        transaction:transaction
      });
    await transaction.commit();
    return res.status(200).json({roomdetails:roomdetails,servicedetails:servicedetails});
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    return res.status(500).json({message:error.message});
  }
}