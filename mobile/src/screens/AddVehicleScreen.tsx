import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Screen } from '../components/Screen';
import { addVehicle, normalizePlate } from '../storage/vehicles';
import { colors, spacing } from '../theme';

type Props = {
  onAdded: () => void;
  onCancel: () => void;
};

export function AddVehicleScreen({ onAdded, onCancel }: Props) {
  const [name, setName] = useState('');
  const [plate, setPlate] = useState('');
  const canSave = name.trim().length > 0 && normalizePlate(plate).length > 0;

  const save = async () => {
    if (!canSave) return;
    await addVehicle({ name, plate });
    onAdded();
  };

  return (
    <Screen
      title="Додади возило"
      back={{ label: 'Откажи', onPress: onCancel }}
      next={{ label: 'Додади', onPress: save, disabled: !canSave }}>
      <View style={styles.field}>
        <Text style={styles.label}>Возило</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Внесете име на возилото"
          placeholderTextColor={colors.muted}
          style={styles.input}
          autoFocus
        />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Регистрација</Text>
        <TextInput
          value={plate}
          onChangeText={setPlate}
          placeholder="Внесете регистрација"
          placeholderTextColor={colors.muted}
          style={styles.input}
          autoCapitalize="characters"
          autoCorrect={false}
          onSubmitEditing={save}
          returnKeyType="done"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: spacing.lg },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    height: 56,
    borderRadius: 2,
    backgroundColor: colors.field,
    borderWidth: 2,
    borderColor: 'transparent',
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
});
