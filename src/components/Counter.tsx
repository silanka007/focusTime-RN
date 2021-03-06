import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { iCounter } from "../../types";

const minutesToMilliSec = (time: number) => time * 1000 * 60;
const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

const Counter = ({
  minutes,
  isStarted,
  setProgress,
  finishReset,
  shouldReset,
  isCompleted
}: iCounter) => {
  const [milliSec, setMillSec] = useState(0);
  let interval: NodeJS.Timeout;

  useEffect(() => {
    if (shouldReset) setMillSec(minutesToMilliSec(minutes));
  }, [shouldReset]);

  useEffect(() => {
    
    setMillSec(minutesToMilliSec(minutes));
  }, [minutes]);

  useEffect(() => {
    const result = milliSec / (minutesToMilliSec(minutes) | 1);
    setProgress(result);
    if(milliSec === 0 && isStarted) finishReset();
  }, [milliSec]);

  useEffect(() => {
    if (isStarted) {
      interval = setInterval(() => {
        setMillSec((timer) => {
          if (timer === 0) {
            clearInterval(interval);
            return timer;
          } else {
            return timer - 1000;
          }
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStarted]);

  const hr = milliSec >= 0 ? Math.floor(milliSec / 60 / 60 / 1000) % 60 : 0;
  const min = milliSec >= 0 ? Math.floor(milliSec / 60 / 1000) % 60 : 0;
  const sec = milliSec >= 0 ? Math.floor(milliSec / 1000) % 60 : 0;
  return (
    <View style={styles(isCompleted).container}>
      <Text style={styles(isCompleted).text}>
      {formatTime(hr)}:{formatTime(min)}:{formatTime(sec)}
      </Text>
    </View>
  );
};

export default Counter;

const styles = (isCompleted: boolean) => StyleSheet.create({
  container: {
    backgroundColor: isCompleted ? "green" : "#0A06A1",
    width: "70%",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 60,
  },
});
