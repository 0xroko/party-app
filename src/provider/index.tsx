import { NavigationContainer } from "@react-navigation/native";
import { ToastProvider } from '@tamagui/toast';
import React, { Suspense } from "react";

import { TamaguiProvider } from "tamagui";
import config from "../tamagui.config";

export const Provider: FCC = ({ children }) => {
	return (
		<TamaguiProvider config={config}>
			<ToastProvider>
				<Suspense>
					<NavigationContainer>{children}</NavigationContainer>
				</Suspense>
			</ToastProvider>
		</TamaguiProvider>
	);
};
