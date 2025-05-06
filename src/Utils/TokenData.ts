class TokenData {
    private id: string | null | undefined;
    private email: string| null | undefined;
    private issued?: number;
    private expire?: number;

    constructor(
        id: string | null | undefined,
        email: string,
        issued?: number,
        expire?: number
      ) {
        this.id = id;
        this.email = email;
        this.issued = issued;
        this.expire = expire;
      }
  
    public getEmail(): string | null | undefined {
      try {
        return this.email;
      } catch (error) {
        throw new Error(
          "It was not possible to recover the email because: " + error
        );
      }
    }
  
    public getId(): string | null | undefined {
      try {
        return this.id;
      } catch (error) {
        throw new Error(
          "It was not possible to recover the id because: " + error
        );
      }
    }
  
    public getIssued(): number | undefined {
      try {
        return this.issued;
      } catch (error) {
        throw new Error(
          "It was not possible to recover the issued timestamp because: " + error
        );
      }
    }
  
    public getExpire(): number | undefined {
      try {
        return this.expire;
      } catch (error) {
        throw new Error(
          "It was not possible to recover the expiration timestamp because: " + error
        );
      }
    }
  
    public setEmail(email: string): void {
      this.email = email;
    }
  
    public setId(id: string | null | undefined): void {
      this.id = id;
    }
  
    public setIssued(issued: number): void {
      this.issued = issued;
    }
  
    public setExpire(expire: number): void {
      this.expire = expire;
    }
  }
  
  export default TokenData;