import AuthForm from '../../components/AuthForm/AuthForm'
import useDocumentTitle from '../../hooks/useDocumentTitle'

function Login() {
  useDocumentTitle('PregnaJoy | Log In')
  return <AuthForm />
}

export default Login
