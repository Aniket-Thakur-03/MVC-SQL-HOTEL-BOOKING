export const CheckoutForm = () => {
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">CheckOut</h2>
          <div className="space-y-4">
            {!newdata.damaged && (
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 focus:ring-green-500"
                    onChange={(e) =>
                      handleInputChange("meal_chosen", e.target.checked)
                    }
                  />
                  <span className="text-sm text-gray-700">
                    Anything Damaged
                  </span>
                </label>
              </div>
            )}

            {newdata.damaged && (
              <>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-gray-300 focus:ring-green-500"
                      checked={newdata.mirror}
                      disabled={!newdata.damaged}
                      onChange={(e) =>
                        handleInputChange("breakfast", e.target.checked)
                      }
                    />
                    <span className="text-sm text-gray-700">
                      Mirror Damage ₹400
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-gray-300 focus:ring-green-500"
                      checked={newdata.door}
                      disabled={!newdata.meal_chosen}
                      onChange={(e) =>
                        handleInputChange("lunch", e.target.checked)
                      }
                    />
                    <span className="text-sm text-gray-700">Add Lunch</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-gray-300 focus:ring-green-500"
                      checked={newdata.dinner}
                      disabled={!newdata.meal_chosen}
                      onChange={(e) =>
                        handleInputChange("dinner", e.target.checked)
                      }
                    />
                    <span className="text-sm text-gray-700">Add Dinner</span>
                  </label>
                </div>
              </>
            )}
          </div>
          <div className="mt-4 text-gray-800">
            <p className="text-sm">
              <span className="font-medium">Total: </span>₹{newdata.total}
            </p>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={() => showModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-300 rounded hover:bg-gray-400 focus:ring focus:ring-gray-400"
            >
              Close
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium text-white rounded focus:ring ${
                isConfirmEnabled
                  ? "bg-green-500 hover:bg-green-600 focus:ring-green-500"
                  : "bg-green-300 cursor-not-allowed"
              }`}
              onClick={() => handleEditing(newdata, booking.booking_id)}
              disabled={!isConfirmEnabled}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
