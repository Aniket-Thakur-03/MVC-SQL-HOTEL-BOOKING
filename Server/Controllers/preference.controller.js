import { AdminPreference } from "../Models/adminpreference.model.js";
import { Useradmin } from "../Models/useradmin.model.js";
import { Feature } from "../Models/feature.model.js";
import { Location } from "../Models/location.model.js";
import sequelize from "../dbconnection.js";

export const assignLocation = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { admin_id, location_id } = req.body;
    const { username } = req.user;
    const findAdmin = await Useradmin.findByPk(Number(admin_id), {
      transaction: transaction,
    });
    if (!findAdmin) {
      throw new Error("Admin not found");
    }
    if (findAdmin.location_id) {
      if (findAdmin.location_id != location_id) {
        throw new Error(
          "Please click Edit button for changing or removing Assigned location"
        );
      } else {
        throw new Error("Admin already assigned to location");
      }
    }
    findAdmin.location_id = location_id;
    await findAdmin.save({ transaction: transaction });
    const allFeatures = await Feature.findAll({ transaction: transaction });
    await Promise.all(
      allFeatures.map((feature) =>
        AdminPreference.create(
          {
            location_id: location_id,
            admin_id: admin_id,
            feature_id: feature.feature_id,
            isgranted: false,
            created_by: username,
            updated_by: username,
          },
          { transaction: transaction }
        )
      )
    );
    await transaction.commit();
    return res.status(200).json({ message: "Admin assigned successfully" });
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const showFeaturePreference = async (req, res) => {
  console.log(req.body);
  try {
    const { admin_id, location_id, feature_id } = req.body;
    console.log(admin_id, location_id, feature_id);
    const granted = await AdminPreference.findOne({
      where: {
        admin_id: admin_id,
        feature_id: feature_id,
      },
    });
    if (!granted) {
      return res.status(404).json({ message: "Preference not found" });
    }

    if (granted.isgranted === true) {
      return res.status(200).json({ message: "Authorized" });
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const allPreferences = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const admins = await Useradmin.findAll({
      attributes: [
        "admin_id",
        "admin_username",
        "location_id",
        "isActive",
        "issuper",
      ],
      transaction: transaction,
    });
    const sortedAdmins = admins.sort((a, b) => a.admin_id - b.admin_id);
    const filteredAdmins = sortedAdmins.filter(
      (admin) => !admin.dataValues.issuper
    );
    // console.log(sortedAdmins);
    // console.log(filteredAdmins);
    const locations = await Promise.all(
      filteredAdmins.map(async (admin) => {
        const location = await Location.findByPk(Number(admin.location_id), {
          attributes: ["location_id", "location_name", "city", "pincode"],
          transaction: transaction,
        });
        const location_assigned = location
          ? `${location.location_name}-${location.city}(${location.pincode})`
          : "Location not found";

        return {
          admin_id: admin.admin_id,
          admin_username: admin.admin_username,
          isActive: admin.isActive,
          location_id: location ? location.location_id : null,
          location_assigned: location_assigned,
        };
      })
    );
    const preferences = await Promise.all(
      locations.map(async (location) => {
        const preference = await AdminPreference.findAll({
          where: {
            admin_id: location.admin_id,
            location_id: location.location_id,
          },
          attributes: ["preference_id", "feature_id", "isgranted"],
          transaction: transaction,
        });
        const sortedPreference = preference.sort(
          (a, b) => a.feature_id - b.feature_id
        );
        return { ...location, preference: sortedPreference };
      })
    );
    await transaction.commit();
    return res.status(200).json({ preferences: preferences });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ message: error.message });
  }
};

export const editPreferences = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { editData } = req.body;
    const { username } = req.user;
    if (
      !editData ||
      !editData.adminId ||
      !editData.locationId ||
      !Array.isArray(editData.preference)
    ) {
      console.error("Invalid edit data:", editData);
      return res.status(400).json({ message: "Invalid edit data provided." });
    }

    console.log("Edit data received:", editData);
    const checkUser = await Useradmin.findByPk(Number(editData.adminId), {
      transaction: transaction,
    });
    if (!checkUser) {
      throw new Error("User not found");
    }

    checkUser.isActive = editData.isActive;

    console.log("Saving user...");
    await checkUser.save({ transaction: transaction });
    console.log("User saved.");

    const checkPreference = await AdminPreference.findAll({
      where: {
        admin_id: Number(editData.adminId),
        location_id: Number(editData.locationId),
      },
      transaction: transaction,
    });

    console.log("Preferences fetched:", checkPreference);

    // Update existing preferences
    await Promise.all(
      checkPreference.map(async (prefer) => {
        try {
          const updatedPreference = editData.preference.find(
            (prefert) => prefert.feature_id === prefer.feature_id
          );
          if (updatedPreference) {
            console.log("Updating preference:", prefer.feature_id);
            prefer.set({
              location_id:
                Number(editData.newlocationId) || Number(editData.locationId),
              isgranted: updatedPreference.isgranted,
              created_by: username,
              updated_by: username,
            });
            await prefer.save({ transaction: transaction });
            console.log("Preference updated:", prefer.feature_id);
          }
        } catch (err) {
          console.error("Error updating preference:", err);
        }
      })
    );

    // Create new preferences for missing feature_ids
    const existingFeatureIds = checkPreference.map(
      (prefer) => prefer.feature_id
    );
    const newPreferences = editData.preference.filter(
      (prefert) => !existingFeatureIds.includes(prefert.feature_id)
    );

    console.log("New preferences to create:", newPreferences);

    await Promise.all(
      newPreferences.map(async (newPref) => {
        try {
          console.log("Creating new preference:", newPref.feature_id);
          await AdminPreference.create(
            {
              admin_id: Number(editData.adminId),
              location_id:
                Number(editData.newlocationId) || Number(editData.locationId),
              feature_id: newPref.feature_id,
              isgranted: newPref.isgranted,
              created_by: username,
              updated_by: username,
            },
            { transaction: transaction }
          );
          console.log("New preference created:", newPref.feature_id);
        } catch (err) {
          console.error("Error creating new preference:", err);
        }
      })
    );

    console.log("Committing transaction...");
    await transaction.commit();
    console.log("Transaction committed.");

    return res
      .status(200)
      .json({ message: "Preferences updated successfully." });
  } catch (error) {
    console.error("Error updating preferences:", error);
    await transaction.rollback();
    return res.status(500).json({ message: error.message });
  }
};

export const seeAdminFeatures = async (req, res) => {
  try {
    const { location_id, admin_id } = req.body;

    const allPreferences = await AdminPreference.findAll({
      where: { location_id, admin_id, isgranted: true },
      attributes: ["feature_id"],
    });

    if (!allPreferences.length) {
      return res.status(200).json({ features: [] });
    }

    const featureIds = allPreferences.map((prefer) => prefer.feature_id);

    const features = await Feature.findAll({
      where: { feature_id: featureIds },
      attributes: ["feature_name", "feature_url", "feature_id"],
    });

    return res.status(200).json({ features });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const addSuperAdminPreference = async (req, res) => {
  try {
    const { issuper, username, admin_id } = req.user;
    const { id } = req.params;
    if (!issuper) {
      return res.status(400).json({ message: "unauthorized" });
    } else {
      const checkFeature = await Feature.findByPk(Number(id));
      if (!checkFeature)
        return res.status(400).json({ message: "Feature does not exist" });
      const checkPreference = await AdminPreference.findOne({
        where: { feature_id: Number(id), admin_id: Number(admin_id) },
      });
      if (checkPreference)
        return res.status(400).json({ message: "Already registered" });
      await AdminPreference.create({
        feature_id: Number(id),
        admin_id: Number(admin_id),
        isgranted: true,
        created_by: username,
        updated_by: username,
      });
      return res.status(200).json({ message: "new feature preference added" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
