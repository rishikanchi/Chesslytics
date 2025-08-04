import colors from "@/styles/colors";
import poppins from "@/styles/fonts";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

type propsType = {
  move: string;
  height?: number;
  fontSize?: number;
  onMoveSelect?: (index: number | null) => void;
  currentMoveIndex?: number | null;
};

const BoardMoveLine: React.FC<propsType> = ({
  move,
  height = 30,
  fontSize = 16,
  onMoveSelect,
  currentMoveIndex = null,
}) => {
  const words = move.split(" ");
  const [highlightedMoveIndex, setHighlightedMoveIndex] = useState<number>(-1);

  // Function to check if a word is a move (not a number or dot)
  const isMove = (word: string) => !word.includes(".") && !/^\d+$/.test(word);

  // Get the actual move index for a word index
  const getMoveIndex = (wordIndex: number): number => {
    let moveCount = 0;
    for (let i = 0; i <= wordIndex; i++) {
      if (isMove(words[i])) {
        moveCount++;
      }
    }
    return moveCount;
  };

  // Update highlighted move when currentMoveIndex changes
  useEffect(() => {
    if (currentMoveIndex !== null) {
      let moveCount = 0;
      for (let i = 0; i < words.length; i++) {
        if (isMove(words[i])) {
          moveCount++;
          if (moveCount === currentMoveIndex) {
            setHighlightedMoveIndex(i);
            break;
          }
        }
      }
    }
  }, [currentMoveIndex, words]);

  // Trigger onMoveSelect when component mounts to ensure synchronization
  useEffect(() => {
    if (words.length > 0) {
      const firstMoveIndex = words.findIndex(isMove);
      if (firstMoveIndex !== -1) {
        onMoveSelect?.(getMoveIndex(firstMoveIndex));
      }
    }
  }, [move]);

  const handleMovePress = (index: number) => {
    if (isMove(words[index])) {
      const moveIndex = getMoveIndex(index);
      setHighlightedMoveIndex(index);
      onMoveSelect?.(moveIndex);
    }
  };

  return (
    <View style={[styles.container, { height: height }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.main}>
          {words.map((word, index) => {
            const isHighlighted =
              isMove(word) && index === highlightedMoveIndex;
            return (
              <React.Fragment key={index}>
                {index > 0 &&
                  (word.includes(".") || words[index - 1].includes(".")) && (
                    <Text> </Text>
                  )}
                <Text> </Text>

                <TouchableWithoutFeedback
                  onPress={() => handleMovePress(index)}
                >
                  <View
                    style={[
                      styles.moveContainer,
                      isHighlighted && styles.highlightedMoveContainer,
                    ]}
                  >
                    <Text
                      style={[
                        word.includes(".") ? styles.dotText : styles.normalText,
                        isHighlighted && styles.highlightedText,
                        { fontSize: fontSize },
                      ]}
                    >
                      {word}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </React.Fragment>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default BoardMoveLine;

const styles = StyleSheet.create({
  container: {
    width: width,
    backgroundColor: colors.secondary,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 10,
    alignItems: "center",
  },
  main: {
    height: 22,
    alignItems: "center",
    flexDirection: "row",
  },
  moveContainer: {
    paddingHorizontal: 1,
    paddingBottom: 2,
    borderRadius: 12,
  },
  highlightedMoveContainer: {
    backgroundColor: colors.primary,
    borderRadius: 10000,
  },
  normalText: {
    fontFamily: poppins.bold,
  },
  dotText: {
    fontFamily: poppins.regular,
  },
  highlightedText: {
    color: "white",
  },
});
