export const validateMiddleware = (schema, property) => {
    return (req, res, next) => {
        const { error } = schema.validate(req[property]);
        const valid = error == null;
        if (valid) {
            next();
        } else {
            const { details } = error;
            const message = details.map((i) => i.message).join(",");
            console.log("error", message);
            return res.status(422).send({ error: message });
        }
    };
};
