import { NextFunction, Request, Response } from "express";

import { User } from "../../models/user.model";
import { checkProjectOwnership, getProvider, getMapTokenUris } from "../../utils/contractUtils";
import { RequestWithSession } from "../../types/requests";
import { AllowlistReservation } from "../../models";

const projectCounts = {
    gawds: 500,
    frwc: 1000,
    cryptocoven: 1000,
    fwb: 100,
    def: 100,
};

export const find = (req: Request, res: Response, next: NextFunction) => {
    // If a query string ?publicAddress=... is given, then filter results
    const whereClause =
        req.query && req.query.publicAddress
            ? {
                  where: { publicAddress: req.query.publicAddress },
              }
            : undefined;

    return User.findAll(whereClause)
        .then((users: User[]) => res.json(users))
        .catch(next);
};

export const get = (req: RequestWithSession, res: Response, next: NextFunction) => {
    if (req.session.userId) {
        return User.findByPk(req.session.userId)
            .then(async (user: User | null) => {
                if (user.publicAddress) {
                    return AllowlistReservation.findByPk(user?.publicAddress).then(
                        (reservation: AllowlistReservation | null) => {
                            res.json(reservation);
                        },
                    );
                }
                res.json(user);
            })
            .catch(next);
    } else {
        return res.status(422).send({ error: "invalid session" });
    }
};

export const create = async (req: RequestWithSession, res: Response, next: NextFunction) => {
    const { projectId } = req.params;
    return res.status(422).send({ error: "giveaway closed" });
    if (!projectCounts.hasOwnProperty(projectId)) {
        return res.status(422).send({ error: "invalid project id" });
    }
    if (req.session.userId) {
        const user = await User.findByPk(req.session.userId);
        if (user) {
            const allowlistReservation = await AllowlistReservation.findByPk(user?.publicAddress);
            if (allowlistReservation) {
                return res.status(422).send({ error: "user already has a reservation" });
            }

            const count = await AllowlistReservation.count({
                where: { project: projectId },
            });

            if (count >= projectCounts[projectId]) {
                return res.status(422).send({ error: "no spots remaining" });
            }

            if (projectId !== "def") {
                const ownership = await checkProjectOwnership(projectId, getProvider(), user.publicAddress);

                if (!ownership) {
                    return res.status(422).send({ error: "user does not own project" });
                }
            }

            return AllowlistReservation.create({
                publicAddress: user.publicAddress,
                project: projectId,
            })
                .then((response) => {
                    return res.json(response);
                })
                .catch(next);
        }
        return res.status(422).send({ error: "user not found" });
    } else {
        return res.status(422).send({ error: "invalid session" });
    }
};

export const count = (req: Request, res: Response, next: NextFunction) => {
    const { projectId } = req.params;
    if (!projectCounts.hasOwnProperty(projectId)) {
        return res.status(422).send({ error: "invalid project id" });
    }
    return AllowlistReservation.count({
        where: { project: projectId },
    })
        .then((count) => {
            return res.json(projectCounts[projectId] - count);
        })
        .catch(next);
};
