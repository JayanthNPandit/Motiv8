import * as Font from 'expo-font';

const loadFonts = async () => {
  await Font.loadAsync({
    'Inter': require('./Inter.ttf'),
    'Poppins': require('./Poppins.ttf'),
    'Poppins-Bold': require('./Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('./Poppins-ExtraBold.ttf'),
    'Poppins-SemiBold': require('./Poppins-SemiBold.ttf'),
  });
};

export default loadFonts;
