export class FormDataModel {
    constructor(private data: {
        firstName: string,
        lastName: string,
        email: string,
        birthday: string,
        voivodeship: string,
        city: string,
        address: string,
        postalCode: string
    }, private timestamp: Date) {}

    public getData() {
        return this.data;
    }

    public getTimestamp() {
        return this.timestamp;
    }

    public setData(data: {
        firstName: string,
        lastName: string,
        email: string,
        birthday: string,
        voivodeship: string,
        city: string,
        address: string,
        postalCode: string
    }) {
        this.data.firstName = data.firstName;
        this.data.lastName = data.lastName;
        this.data.email = data.email;
        this.data.birthday = data.birthday;
        this.data.voivodeship = data.voivodeship;
        this.data.city = data.city;
        this.data.address = data.address;
        this.data.postalCode = data.postalCode;
    }
}