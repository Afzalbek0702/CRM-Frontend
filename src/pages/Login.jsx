// Login page converted to shadcn/ui components

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import phoneFormat from "../utils/phoneFormat";
import { useAuth } from "../context/authContext";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	InputGroup,
	InputGroupInput,
	InputGroupAddon,
} from "@/components/ui/input-group";

const Login = () => {
	const [formData, setFormData] = useState({ password: "", phone: "+(998)" });
	const { login, loading } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		const data = await login({
			phone: phoneFormat.cleanUzPhone(formData.phone),
			password: formData.password,
		});

		navigate(`/${data.tenant}/dashboard`);
	};

	const handlePhoneChange = (e) => {
		setFormData({
			...formData,
			phone: phoneFormat.formatPhone(e.target.value),
		});
	};

	return (
		<div className="flex min-h-screen items-center justify-center">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle className="flex items-center justify-center gap-2">
						<img src="/logo.jpg" alt="logo" className="h-8 w-8" />
						Data Space
					</CardTitle>
					<CardDescription>Iltimos xisobingizga kiring.</CardDescription>
				</CardHeader>

				<CardContent>
					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<div className="modal-inputs">
							<div>
								<label htmlFor="phone" className="text-sm font-medium">
									Telefon raqam
								</label>
								<InputGroup>
									<InputGroupInput
										id="phone"
										type="tel"
										value={formData.phone}
										onChange={handlePhoneChange}
										placeholder="+998 __-___-__-__"
										required
									/>
								</InputGroup>
							</div>

							<div>
								<label htmlFor="password" className="text-sm font-medium">
									Parol
								</label>
								<InputGroup>
									<InputGroupInput
										id="password"
										type="password"
										value={formData.password}
										onChange={(e) =>
											setFormData({ ...formData, password: e.target.value })
										}
										placeholder="********"
										required
									/>
								</InputGroup>
							</div>
						</div>

						<Button type="submit" disabled={loading} className={"btn-default"}>
							{loading ? "Logging in..." : "Login"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default Login;
