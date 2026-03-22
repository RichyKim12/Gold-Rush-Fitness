import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { DayRecord } from "../constants/mockData";
import { DAILY_STEP_GOAL } from "../constants/theme";

const stepCount = "HKQuantityTypeIdentifierStepCount" as const;

const useWeeklySteps = () => {
  const [weekHistory, setWeekHistory] = useState<DayRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (Platform.OS !== "ios") return;

    const fetchWeek = async () => {
      try {
        const HealthKit =
          require("@kingstinct/react-native-healthkit").default;

        // Build last 7 days starting from 6 days ago → today
        const days: DayRecord[] = [];

        for (let i = 6; i >= 0; i--) {
          const day = new Date();
          day.setDate(day.getDate() - i);

          const start = new Date(day);
          start.setHours(0, 0, 0, 0);

          const end = new Date(day);
          end.setHours(23, 59, 59, 999);

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

          const steps = Math.round(result?.sumQuantity?.quantity ?? 0);

          days.push({
            date: start.toISOString().split("T")[0],
            steps,
            goalMet: steps >= DAILY_STEP_GOAL,
          });
        }

        setWeekHistory(days);
      } catch (err) {
        console.error("Error fetching weekly steps:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeek();
  }, []);

  return { weekHistory, loading };
};

export default useWeeklySteps;
