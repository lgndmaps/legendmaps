import { Formik, Field, Form, FormikHelpers } from "formik";
import settings from "../../../settings";

interface Values {
    password: string;
}

export default function DevAuthForm() {
    return (
        <div>
            <h1 className="display-6 mb-3">Login</h1>
            <Formik
                initialValues={{
                    password: "",
                }}
                onSubmit={(values: Values, { setSubmitting }: FormikHelpers<Values>) => {
                    if (values.password === settings.DEV_AUTH_PASSWORD) {
                        localStorage.setItem("devauth", values.password);
                        window.location.reload();
                    }
                    setSubmitting(false);
                }}
            >
                <Form>
                    <div className="mb-3">
                        <Field
                            className="form-control"
                            id="password"
                            name="password"
                            placeholder="Password"
                            type="password"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Login
                    </button>
                </Form>
            </Formik>
        </div>
    );
}
