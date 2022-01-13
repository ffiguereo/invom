import { AggregateRoot } from "../../../Shared/domain/AggregateRoot";
import { CompanyId } from "../../Shared/domain/Company/CompanyId";
import { CompanyEmail } from "./CompanyEmail";
import { CompanyName } from "./CompanyName";

export class Company extends AggregateRoot {
  readonly id: CompanyId;
  readonly name: CompanyName;
  readonly email: CompanyEmail;

  constructor(id: CompanyId, name: CompanyName, email: CompanyEmail) {
    super();
    this.id = id;
    this.name = name;
    this.email = email;
  }
}
