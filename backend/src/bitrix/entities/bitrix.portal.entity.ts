import {
    Entity,
    Column,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { InstallCheck } from "./bitrix.installCheck.entity";

@Entity({ name: "bitrix_portal" })
export class BitrixPortal {
    @PrimaryGeneratedColumn({ name: "id", type: "int" })
    portalId: number;

    @Column({ name: "domain", type: "varchar", length: 255, unique: true})
    domain: string;

    @Column({ name: "scopes", type: "text" })
    scopes: string;

    @OneToMany(() => InstallCheck, (installCheck) => installCheck.portal)
    checkInstalls: InstallCheck[];
}