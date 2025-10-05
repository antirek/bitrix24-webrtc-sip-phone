import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { BitrixPortal } from "./bitrix.portal.entity";

@Entity({ name: "install_check" })
export class InstallCheck {
    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @ManyToOne(() => BitrixPortal, (bitrixPortal) => bitrixPortal.checkInstalls, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "p_id", referencedColumnName: "portalId" })
    portal: BitrixPortal;

    @CreateDateColumn({ name: "created_at", type: 'timestamp' })
    createdAt: Date;

    @Column({ name: "event", type: "varchar", length: 255 })
    event: string;

    @Column({ name: "install_data", type: "json" })
    installData: any;
}