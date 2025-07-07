import { FormComponent } from "components/Form";
import InputComponent from "components/Input";
import { getAxios, postAxios } from "../../services/axios-api";
import { useRouter } from "expo-router";
import { YStackTheme } from "components/Layout/Flexbox/StackTheme";

export default function SignInScreen() {
  const router = useRouter();
  const handleInputEmail: (data: any) => void = (data) => {
    console.log(data);
  };

  const handleFormSignIn = async (dataForm: any) => {
    delete dataForm.email;
    let data = await postAxios< typeof dataForm & {id:number}, typeof dataForm>('token/', {...dataForm});
    console.log("DATA: ",data);
   if(data.status === 200) router.push('/(app)/home');
  };

  return (
    <YStackTheme flex={1} items={"center"} justify={"center"}>
      <FormComponent
        callbackSubmit={handleFormSignIn}
        textHeaderForm="Login"
        size={"$1.5"}
      >
        <InputComponent
          callbackTreatment={handleInputEmail}
          nameInput="username"
          textLabel="teste"
          textPlaceHolder=""
        ></InputComponent>
        <InputComponent
          nameInput="password"
          textLabel="teste"
          textPlaceHolder=""
        ></InputComponent>
      </FormComponent>
    </YStackTheme>
  );
}
