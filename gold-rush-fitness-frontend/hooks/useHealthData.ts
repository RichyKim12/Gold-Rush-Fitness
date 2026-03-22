import { useEffect, useState } from "react";
import { Platform } from "react-native";

const stepCount = "HKQuantityTypeIdentifierStepCount" as const;

const useHealthData = (date: Date) => {
  const [steps, setSteps] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [hasPermissions, setHasPermissions] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "ios") {
      setError("HealthKit is only available on iOS");
      return;
    }

    const requestPermissions = async () => {
      try {
        const HealthKit =
          require("@kingstinct/react-native-healthkit").default;

        await HealthKit.requestAuthorization({
          toRead: [stepCount],
        });

        setHasPermissions(true);
        setError(null);
      } catch (err: any) {
        const msg =
          err?.message ?? err?.localizedDescription ?? String(err);
        console.error("HealthKit permission error:", msg);
        setError(`HealthKit error: ${msg}`);
      }
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    if (!hasPermissions) return;

    const fetchSteps = async () => {
      try {
        const HealthKit =
          require("@kingstinct/react-native-healthkit").default;

        const start = new Date(date);
        start.setHours(0, 0, 0, 0);

        const end = new Date(date);
        end.setHours(23, 59, 59, 999);

        // ✅ Use statistics API with correct date filter and unit
        const result = await HealthKit.queryStatisticsForQuantity(
          stepCount,
          ["cumulativeSum"],
          {
            unit: "count",
            filter: {
              date: {
                startDate: start,
                endDate: end,
              },
            },
          }
        );

        console.log("Step statistics result:", result);

        // sumQuantity contains { quantity: number, unit: string }
        const total = result?.sumQuantity?.quantity ?? 0;

        setSteps(Math.round(total));
        setError(null);
      } catch (err: any) {
        const msg =
          err?.message ?? err?.localizedDescription ?? String(err);
        console.error("Error fetching steps:", msg);
        setError(`Fetch error: ${msg}`);
      }
    };

    fetchSteps();
  }, [hasPermissions, date]);

  return { steps, error, hasPermissions };
};

export default useHealthData;
export type UseHealthDataReturn = ReturnType<typeof useHealthData>;
