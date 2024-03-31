import { StyleSheet } from 'react-native';

export const textStyles = StyleSheet.create({
    title: {
        color: 'black',
        fontSize: 48,
        fontFamily: 'Poppins-ExtraBold',
        fontWeight: '700',
    },
    header: {
        color: 'black',
        fontSize: 24,
        fontFamily: 'Poppins-ExtraBold',
        fontWeight: '600',
        lineHeight: 32,
    },
    subheader: {
        color: 'black',
        fontSize: 20,
        fontFamily: 'Poppins-Regular',
        fontWeight: '500',
        lineHeight: 32,
    },
    sectionHeader: {
        color: 'black',
        fontSize: 20,
        fontFamily: 'Poppins',
        fontWeight: '500',
        lineHeight: 32,
        textAlign: 'left',
        justifyContent: 'flex-start',
    },
    textBodyHeader: {
        color: 'black',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        fontWeight: '400',
        lineHeight: 24,
    },
    textBodyHeaderWhite: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        fontWeight: '400',
        lineHeight: 24,
    },
    textBodyHeaderBold: {
        color: 'black',
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        fontWeight: '400',
        lineHeight: 24,
    },
    textBody: {
        color: 'black',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        fontWeight: '400',
        lineHeight: 24,
    },
    textBodyGray: {
        color: '#8E99AB',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        fontWeight: '400',
        lineHeight: 24,
    },
    textBodyBold: {
        color: 'black',
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        fontWeight: '400',
        lineHeight: 24,
    },
    textBodySmall: {
        color: 'black',
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        fontWeight: '400',
        lineHeight: 24,
    },
    textBodySmallUnderline: {
        color: 'black',
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        fontWeight: '400',
        textDecorationLine: 'underline',
        lineHeight: 24,
    },
    goalText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Poppins',
        fontWeight: '400',
        lineHeight: 24,
    },
})

export const containerStyles = StyleSheet.create({
    // MAKE SURE BACKGROUND IS WHITE
    background: {
        backgroundColor:'white',
        flex: 1
    },
    // MAIN CONTAINER
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginHorizontal: '5%',
        marginTop: '20%',
        marginBottom: '15%',
        backgroundColor: 'white',
    },
    // HEADER CONTAINER
    headerContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '5%',
        gap: 4
    },
    // TEXT INPUT
    inputContainer: {
        flexDirection: 'column', 
        justifyContent: 'flex-start', 
        alignItems: 'flex-start',
        gap: 10, 
        display: 'flex',
        marginBottom: '5%',
        width: '92%'
    },
    input: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#939393',
        width: '100%', 
        paddingHorizontal: '2%',
        paddingVertical: '4.5%',
    },
    // BUTTONS
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginVertical: '5%',
    },
    whiteButton: {
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',
        paddingVertical: '1%',
        paddingHorizontal: '2%',
        backgroundColor: 'white',
        borderRadius: '1%', 
        gap: '1%',
        marginVertical: '1%',
    },
    purpleButton: {
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',
        paddingVertical: '4%',
        paddingHorizontal: '15%',
        backgroundColor: '#4044AB',
        borderRadius: 31, 
        gap: 10,
        marginVertical: '5%'
    },
    greenButton: {
        display: 'flex',
        justifyContent: 'right', 
        alignItems: 'center',
        paddingVertical: '4%',
        paddingHorizontal: '4%',
        backgroundColor: '#1B7032',
        borderRadius: 5, 
        marginVertical: '5%'
    },
    longWhiteButton: {
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',
        paddingVertical: '4%',
        paddingHorizontal: '36%',
        backgroundColor: 'white',
        borderRadius: 29, 
        borderWidth: 1,
        gap: 10,
        marginVertical: '4%'
    },
    longPurpleButton: {
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',
        paddingVertical: '4%',
        paddingHorizontal: '35%',
        backgroundColor: '#4044AB',
        borderRadius: 29, 
        gap: 10,
        marginVertical: '4%'
    },
    // LIST
    listContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginBottom: '10%'
    },
    // GOAL CONTAINER
    goalContainer: {
        alignItems: 'flex-start', 
        paddingVertical: '5%',
        paddingHorizontal: '4%',
        backgroundColor: '#111111',
        borderRadius: '20%', 
        borderColor: '#FFFFFF',
        borderWidth: '10%',
        gap: '10%',
        marginVertical: '4%'
    },
    pinnedGoalContainer: {
        alignItems: 'flex-start', 
        paddingVertical: '5%',
        paddingHorizontal: '4%',
        backgroundColor: '#4044AB',
        marginVertical: '10%',
        width: '100%'
    },
})