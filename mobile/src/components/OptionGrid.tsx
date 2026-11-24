import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, spacing } from '../theme';

type Props<T> = {
  items: T[];
  keyOf: (item: T) => string;
  render: (item: T) => ReactNode;
  onSelect: (item: T) => void;
  selectedKey?: string;
  /** Rendered in the tile's top-right corner, e.g. a remove button. */
  corner?: (item: T) => ReactNode;
};

/** Two-column grid of tappable tiles, the look of the web app's check fields. */
export function OptionGrid<T>({ items, keyOf, render, onSelect, selectedKey, corner }: Props<T>) {
  return (
    <View style={styles.grid}>
      {items.map((item) => {
        const key = keyOf(item);
        const selected = key === selectedKey;
        return (
          <View key={key} style={styles.cell}>
            <Pressable
              onPress={() => onSelect(item)}
              style={({ pressed }) => [
                styles.tile,
                selected && styles.tileSelected,
                pressed && styles.tilePressed,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected }}>
              {render(item)}
              {corner && <View style={styles.corner}>{corner(item)}</View>}
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.sm,
  },
  cell: {
    width: '50%',
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.md,
  },
  tile: {
    minHeight: 100,
    backgroundColor: colors.field,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
  },
  tileSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  tilePressed: {
    opacity: 0.7,
  },
  corner: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
  },
});
