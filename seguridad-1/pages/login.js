import { useState } from "react";
import { userServiceFactory } from "../clientServices/userService";
import useUser from "../lib/useUser";
import Navbar from "../components/Navbar";

const userService = userServiceFactory();

export default function Login() {
	const { user, mutateUser } = useUser({
		redirectTo: "/",
		redirectIfFound: true,
	});

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [_2FA, set2FA] = useState("");

	const [_2FA_step, set2FA_step] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const user = await userService.login(email, password);
			console.log("userLOGIN", user);
			set2FA_step(true);
		} catch (error) {
			alert(error.response.data.error);
		}
	};

	const handleSubmit2FA = async (e) => {
		e.preventDefault();
		try {
			const user = await userService._2FA(email, _2FA);
			console.log("user2FA", user);
			mutateUser(user);
		} catch (error) {
			alert(error.response.data.error);
		}
	};

	const emailHandler = (e) => {
		setEmail(e.target.value);
	};

	const passwordHandler = (e) => {
		setPassword(e.target.value);
	};

	const _2FAHandler = (e) => {
		set2FA(e.target.value);
	};


	return (
		<div>
			{!user ? (
				<h1>Loading....</h1>
			) : (
				<>
					{!user.isLoggedIn && (
						<>
							<Navbar />
							<div className="stackv">

								<h1>LOGIN TO TASK MANAGER</h1>
								<div className="imgcontainer">
									<img
										src="https://www.investors.com/wp-content/uploads/2016/02/IT14-IMPV-020516-shutterstock.jpg"
										alt="Avatar"
										className="avatar"
										style={{
											height: "200px",
											width: "200px",
											borderRadius: 150,
											overflow: "hidden",
											borderWidth: 3,
											borderColor: "red",
										}}
									/>
								</div>
							</div>
							{!_2FA_step && (
								<form onSubmit={handleSubmit}>
									<div className="stackv">
										<br />
										<div className="container">
											<label htmlFor="email">
												<b>Email </b>
											</label>
											<input
												type="email"
												placeholder="Enter Email"
												name="email"
												required
												onChange={emailHandler}
											/>

											<label htmlFor="psw">
												<b> Password </b>
											</label>
											<input
												type="password"
												placeholder="Enter Password"
												name="psw"
												required
												onChange={passwordHandler}
											/>

											<button type="submit">Login</button>
										</div>
									</div>
								</form>
							)}
							{_2FA_step && (
								<form onSubmit={handleSubmit2FA}>
									<br />

									<div className="stackv">
										<b>2FA Code sent to {email}</b>
										<br />
										<br />
										<div className="container">
											<input
												type="text"
												placeholder="Enter 2FA Code"
												name="2fa"
												required
												onChange={_2FAHandler}
											/>

										</div>
										<button type="submit">Validate 2FA</button>
									</div>
								</form>
							)}
						</>
					)}
				</>
			)}
		</div>
	);
}
