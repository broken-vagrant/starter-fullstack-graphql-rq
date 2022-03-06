import { useMutation } from "@apollo/client";

const SignUp = () => {
   //  TODO
   // check mutations & add fragments for signup
   // test login functionality & refresh token
   // hide passwordHash on server,remove posts from signup arg
   const [signUp] = useMutation(SignUpMutation); 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const elements = e.currentTarget.elements;
    try {

    }

  }
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="name"/>
        <input
          type="email"
          name="email"
          placeholder="email"
        />
        <input
          type="password"
          name="password"
          placeholder="password"
        />
        <button type="submit">Sign up</button>
      </form>
    </div>
  )
}

export default SignUp;