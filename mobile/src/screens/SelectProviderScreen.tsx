import { Image, StyleSheet } from 'react-native';
import { OptionGrid } from '../components/OptionGrid';
import { Screen } from '../components/Screen';
import { providers, type Provider } from '../data/providers';

type Props = {
  onSelect: (provider: Provider) => void;
  onBack: () => void;
};

export function SelectProviderScreen({ onSelect, onBack }: Props) {
  return (
    <Screen title="Паркинг" back={{ label: 'Назад', onPress: onBack }}>
      <OptionGrid
        items={providers}
        keyOf={(p) => p.id}
        onSelect={onSelect}
        render={(p) => (
          <Image source={p.logo} style={styles.logo} resizeMode="contain" accessibilityLabel={p.name} />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  logo: { width: '100%', height: 70 },
});
