import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Channels } from '../../entities/Channels';
import { Workspaces } from '../../entities/Workspaces';

//FIXME: watch this later
export class UserSeed implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(Channels);
    await repository.insert([
      {
        id: 2,
        name: 'slack2',
        private: true,
        WorkspaceId: 1,
      },
    ]);

    // ---------------------------------------------------

    // const channelFactory = await factoryManager.get(Channels);
    // // save 1 factory generated entity, to the database
    // await channelFactory.save();

    // // save 5 factory generated entities, to the database
    // // await userFactory.saveMany(5);
  }
}
