import { View, Text } from 'react-native'

export const LoadingScreen = () => {
    return (
        <View style = {{height: '100%', width: '20', backgroundColor: 'white', justifyContent: 'center', alignItems:'center'}}>
            <Text style={{color: 'green', fontSize: 30}}>Loading</Text>
        </View>
    )
}