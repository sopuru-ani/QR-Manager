import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { FiClock } from "react-icons/fi";

function ScanActivity({ data }) {
  return data.length === 0 ? (
    <>
      <h3 className="text-lg font-semibold text-gray-dark mb-2">
        Scan Activity (7 Days)
      </h3>
      <div className="flex flex-col items-center justify-center h-[250px] text-center p-6 bg-white rounded-xl ">
        <div className="p-4 rounded-full bg-gray-100 mb-3">
          <FiClock className="text-gray-600" size={28} />
        </div>

        <h2 className="text-xl font-semibold text-gray-700">No recent scans</h2>

        <p className="text-gray-500 text-sm mt-1">
          You haven’t had any scans in the last 7 days.
        </p>

        <p className="text-gray-400 text-xs mt-1 italic">
          Once someone scans your QR code, activity will appear here.
        </p>
      </div>
    </>
  ) : (
    <div className="bg-white rounded-lg w-full">
      <h3 className="text-lg font-semibold text-gray-dark mb-2">
        Scan Activity (7 Days)
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="_id" interval={0} tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#4ade80" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ScanActivity;
