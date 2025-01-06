import { ExtraService } from "../Models/extraservies.model.js";

export const addExtraServiceAdmin = async (req, res) => {
  try {
    const { service_name, service_price, locationId, isactive, gst_rate } =
      req.body;
    console.log(service_name, service_price, locationId, isactive);
    const { username } = req.user;
    await ExtraService.create({
      service_name: service_name,
      service_price: Number(service_price),
      isactive: isactive,
      location_id: Number(locationId),
      gst_rate: Number(gst_rate),
      created_by: username,
      updated_by: username,
    });
    return res.status(200).json({ message: "Extra service created" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const editExtraServiceAdmin = async (req, res) => {
  try {
    const { service_name, service_price, gst_rate, isactive } = req.body;
    console.log(service_name, service_price, gst_rate, isactive);
    const { username } = req.user;
    const checkService = await ExtraService.findByPk(Number(req.params.id));
    if (service_name) checkService.service_name = service_name;
    if (service_price) checkService.service_price = service_price;
    if (gst_rate) checkService.gst_rate = Number(gst_rate);
    checkService.isactive = isactive;
    checkService.updated_by = username;
    await checkService.save();
    return res.status(200).json({ message: "Extra service updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getExtraServiceAdmin = async (req, res) => {
  try {
    const services = await ExtraService.findAll({
      where: { location_id: Number(req.params.id) },
    });
    if (services.length === 0)
      return res
        .status(200)
        .json({ message: "No extra services", services: [] });

    const sorted = services.sort((a, b) => a.service_id - b.service_id);
    return res.status(200).json({ services: sorted });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getActiveExtraServices = async (req, res) => {
  try {
    const services = await ExtraService.findAll({
      where: { location_id: Number(req.params.id), isactive: true },
      attributes: ["service_id", "service_name", "service_price", "gst_rate"],
    });
    if (services.length === 0)
      return res
        .status(200)
        .json({ message: "No extra services", services: [] });

    const sorted = services.sort((a, b) => a.service_id - b.service_id);
    return res.status(200).json({ services: sorted });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
