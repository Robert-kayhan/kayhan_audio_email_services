// import { userInfo } from "os";

const UserInfoStep = ({ formData, handleChange }: any) => {
    const classes = "w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500"
    return(
    
  <>
    <input
    className={classes}
      placeholder="First Name"
      value={formData.userInfo.firstname}
      onChange={(e: any) =>
        handleChange("userInfo", "firstname", e.target.value)
      }
    />
    <input
    className={classes}

      placeholder="Last Name"
      value={formData.userInfo.lastname}
      onChange={(e: any) =>
        handleChange("userInfo", "lastname", e.target.value)
      }
    />
    <input
    className={classes}
      type="email"
      placeholder="Email"
      value={formData.userInfo.email}
      onChange={(e: any) => handleChange("userInfo", "email", e.target.value)}
    />
    <input
    className={classes}
      type="tel"
      placeholder="Phone"
      value={formData.userInfo.phone}
      onChange={(e: any) => handleChange("userInfo", "phone", e.target.value)}
    />
  </>
);
}

export default UserInfoStep