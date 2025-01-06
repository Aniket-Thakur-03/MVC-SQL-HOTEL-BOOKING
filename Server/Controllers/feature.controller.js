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

export const editFeature = async (req, res) => {
  try {
    const { feature_name, feature_id, isActive } = req.body;
    const { username } = req.user;
    const editfeature = await Feature.findByPk(Number(feature_id));
    if (feature_name !== editfeature.feature_name)
      editfeature.feature_name = feature_name;
    editfeature.isActive = isActive;
    editfeature.updated_by = username;
    await editfeature.save();
    return res.status(200).json({ message: "Featue Updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
