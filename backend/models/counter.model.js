import mongoose from "mongoose";


const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // e.g. "sales_order"
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);


export const getNextSequence = async (counterName, session = null) => {
  const counter = await Counter.findByIdAndUpdate(
    counterName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true, session }
  );
  return counter.seq;
};


export const formatReference = (prefix, seq, padLength = 6) => {
  return `${prefix}-${String(seq).padStart(padLength, "0")}`;
};

export default Counter;
