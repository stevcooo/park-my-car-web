import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, footerHeight, spacing } from '../theme';

type FooterButton = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

type Props = {
  title: string;
  children: ReactNode;
  back?: FooterButton;
  next?: FooterButton;
  /** A small text link to the right of the heading, e.g. "Settings". */
  headerAction?: { label: string; onPress: () => void };
};

/** A wizard step: heading, scrolling body, and the fixed two-button footer. */
export function Screen({ title, children, back, next, headerAction }: Props) {
  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.heading}>{title}</Text>
          {headerAction && (
            <Pressable onPress={headerAction.onPress} hitSlop={8} accessibilityRole="link">
              <Text style={styles.headerAction}>{headerAction.label}</Text>
            </Pressable>
          )}
        </View>
        {children}
      </ScrollView>
      {(back || next) && (
        <View style={styles.footer}>
          {back && (
            <Pressable
              onPress={back.onPress}
              disabled={back.disabled}
              style={[styles.footerButton, styles.backButton, back.disabled && styles.disabled]}
              accessibilityRole="button">
              <Text style={styles.footerLabel}>{back.label}</Text>
            </Pressable>
          )}
          {next && (
            <Pressable
              onPress={next.onPress}
              disabled={next.disabled}
              style={[styles.footerButton, styles.nextButton, next.disabled && styles.disabled]}
              accessibilityRole="button">
              <Text style={styles.footerLabel}>{next.label}</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  body: {
    padding: spacing.md,
    paddingBottom: footerHeight + spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: spacing.lg,
  },
  heading: {
    fontSize: 23,
    fontWeight: 'bold',
    color: colors.text,
    flexShrink: 1,
  },
  headerAction: { color: colors.primary, fontSize: 16 },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: footerHeight,
    flexDirection: 'row',
  },
  footerButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: { backgroundColor: colors.text },
  nextButton: { backgroundColor: colors.primary },
  disabled: { opacity: 0.4 },
  footerLabel: {
    color: colors.textOnDark,
    fontSize: 18,
  },
});
