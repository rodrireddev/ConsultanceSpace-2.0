import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInfo } from "../Log/actions";

// Carga el perfil completo (info) del usuario logueado y lo vuelve a pedir si cambia el usuario.
export default function useProfileInfo() {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.reducerLog.user);

  useEffect(() => {
    if (user.email && user.tipo_usuario) dispatch(getInfo(user));
  }, [dispatch, user]);
}
