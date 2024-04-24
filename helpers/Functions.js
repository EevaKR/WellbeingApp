export const convertFirebaseTimeStampToJS = (time) => {
  if (time !== null && time !== undefined) {
      const fireBaseTime = new Date(
          time.seconds * 1000 + time.nanoseconds / 1000000,
      );
      return fireBaseTime.getFullYear() + ' ' +
      (fireBaseTime.getMonth() + 1) + '-' +
      fireBaseTime.getDate() + '-' 
        
          
  }
}