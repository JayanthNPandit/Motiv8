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
        fontFamily: 'Poppins-Regular',
        fontWeight: '500',
        lineHeight: 32,
        textAlign: 'left',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
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
        textAlign: 'center',
    },
    textBodyBold: {
        color: 'black',
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        fontWeight: '400',
        lineHeight: 24,
    },
    textBodyBoldPurple: {
        color: '#4044AB',
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
    textBodySmallWhite: {
        color: 'white',
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
        fontFamily: 'Poppins-Regular',
        fontWeight: '400',
        lineHeight: 24,
    },
    blackGoalText: {
        color: 'black',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        fontWeight: '400',
        lineHeight: 24,
    },
    whiteDateText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        fontWeight: '400',
        lineHeight: 24,
    },
    cameraGoalText: {
        color: 'black',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        fontWeight: '400',
        lineHeight: 24,
    },
    bottomText: {
        color: 'black',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        lineHeight: 50,
    },
    arrowText: {
        color: 'black',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        lineHeight: 20,
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
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '5%',
        gap: '4%'
    },
    addGoalHeaderContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '2%',
        gap: 4
    },
    goalsHeaderContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginBottom: '5%',
        gap: 4
    },
    // TEXT INPUT
    inputContainer: {
        flexDirection: 'column', 
        justifyContent: 'flex-start', 
        alignItems: 'flex-start',
        gap: '10%', 
        display: 'flex',
        marginBottom: '5%',
        width: '92%',
        marginHorizontal: '10%',
        borderColor: '#111111',
        borderRadius: '10%',
    },
    purpleInputContainer: {
        flexDirection: 'column', 
        justifyContent: 'flex-start', 
        alignItems: 'flex-start',
        gap: '10%', 
        display: 'flex',
        marginBottom: '5%',
        width: '92%',
        marginTop: '5%',
        marginHorizontal: '10%',
        borderColor: '#111111',
        borderWidth: '1%',
        borderRadius: '10%',
        padding: '5%',
        backgroundColor: '#DEDEED',
    },
    input: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#111111',
        width: '100%', 
        paddingHorizontal: '2%',
        paddingVertical: '4.5%',
    },
    dateInput: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#939393',
        width: '100%', 
        paddingHorizontal: '2%',
        paddingVertical: '4.5%',
        color: 'white',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        fontWeight: '400',
        lineHeight: 24,
    },
    frequencyInput: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#939393',
        width: '100%',
        paddingHorizontal: '5%',
        paddingVertical: '5%',
        display: 'flex',
        flexDirection: 'row',
        width: 150,
        maxHeight: 200,
    },
    counterInput: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#939393',
        width: '100%',
        paddingHorizontal: '5%',
        paddingVertical: '5%',
        display: 'flex',
        flexDirection: 'row',
        width: 50,
        height: 50,
    },
    biggerInput: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#939393',
        width: '100%', 
        paddingHorizontal: '2%',
        paddingVertical: '5%',
    },
    // BUTTONS
    buttonContainer: {
        alignItems: 'flex-start', 
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: '10%',
        marginVertical: '5%',
    },
    goalsButtonContainer: {
        alignItems: 'flex-start', 
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: '10%',
        marginVertical: '1%',
    },
    whiteButton: {
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',
        paddingVertical: '4%',
        paddingHorizontal: '15%',
        backgroundColor: 'white',
        borderRadius: 31, 
        gap: 10,
        marginVertical: '5%',
        borderWidth: 1,
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
    blackButton: {
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',
        paddingVertical: '4%',
        paddingHorizontal: '15%',
        backgroundColor: '#000000',
        borderRadius: 31, 
        gap: 10,
        marginVertical: '5%'
    },
    greenButton: {
        position: 'absolute',
        right:'-200%',
        paddingVertical: '0%',
        paddingHorizontal: '0%',
        borderColor: '#000000',
        borderWidth: 1,
        borderRadius: 31,
        backgroundColor: '#000000',
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
        marginBottom: '1%',
    },
    // GOAL CONTAINER
    itemContainer: {
        alignItems: 'flex-start', 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '10%',
        marginVertical: '5%',
    },
    recurringGoalContainer: {
        alignItems: 'flex-start',
        flexDirection: 'row', 
        justifyContent: 'space-between',
        paddingVertical: '5%',
        paddingHorizontal: '15%',
        backgroundColor: '#111111',
        borderRadius: '15%', 
        borderColor: '#FFFFFF',
        borderWidth: '5%',
        gap: '30%',
        marginVertical: '1%'
    },
    longTermGoalContainer: {
        alignItems: 'flex-start',
        flexDirection: 'row', 
        justifyContent: 'space-between',
        paddingVertical: '5%',
        paddingHorizontal: '4%',
        backgroundColor: '#E9EAFF',
        marginVertical: '3%',
        width: '100%',
        borderRadius: '10%',
        borderColor: '#000000',
        borderWidth: '1%',
    },
    pinnedGoalContainer: {
        alignItems: 'flex-start', 
        paddingVertical: '5%',
        paddingHorizontal: '4%',
        backgroundColor: '#4044AB',
        marginVertical: '1%',
        width: '100%',
        gap: '1%',
        marginBottom: '5%'
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#939393',
        marginVertical: '5%',
    },
    frequencyInputContainer: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '5%',
        marginVertical: '1%',
    },
    counterInputContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '5%',
        marginVertical: '5%',
    },
    imageContainer: {
        alignItems: 'center',
    },
    dropdownContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'absolute',
        top: '100%', // Position it below the container
        left: 0,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: '10%',
        paddingVertical: 5,
        paddingHorizontal: 10,
        zIndex: 1, // Ensure it appears above other content
    },
    calendarContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '5%',
        marginVertical: '5%',
    },
    menuContainer: {
        flexDirection: 'row',
        alignItems: 'center', // Center items vertically
        paddingHorizontal: 20,
        flex: 1, // Ensure the container takes full width
        justifyContent: 'space-between', // Distribute items along the row
    },
    datePicker: {
        borderRadius: 16,
        borderWidth: 1,
        backgroundColor: '#111111',
        width: '100%', 
        paddingHorizontal: '2%',
        paddingVertical: '5%',
    },
})