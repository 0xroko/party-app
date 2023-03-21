import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC } from "react";
import {
	useSafeAreaInsets
} from 'react-native-safe-area-context';
import {
	Button,
	H1, Paragraph, XStack, YStack
} from "tamagui";
import { MyStack } from "../../components/MyStack";

export const HomeScreen: FC<
	NativeStackScreenProps<StackNavigatorParams, "home">
> = ({ navigation }) => {
	const insets = useSafeAreaInsets();

	return (

		<MyStack>
			<YStack
				paddingTop={insets.top}
				space="$4"
				maxWidth={600}
			>
				<H1 textAlign="left">Dobrodosli u Party App</H1>
				<Paragraph textAlign="left">
					Cool party je bliže nego što misliš!
				</Paragraph>
			</YStack>

			<YStack space="$5">

				<XStack justifyContent="space-between" marginHorizontal="$2">
					<Button>Kreiraj račun</Button>
					<Button themeInverse>Ulogriaj se</Button>
				</XStack>
			</YStack>

		</MyStack>
	);
};
