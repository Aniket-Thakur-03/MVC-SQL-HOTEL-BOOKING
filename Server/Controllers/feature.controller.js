import { Feature } from "../Models/feature.model.js";

export const getFeatures = async (req, res) => {
  try {
    const features = await Feature.findAll();
    return res.status(200).json({ features: features });
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message });
  }
};
