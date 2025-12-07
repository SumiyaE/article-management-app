import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let expectedResponce: { id: number; title: string; content: string }[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticlesService],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);

    // 記事一覧のインメモリ初期データ
    expectedResponce = [{
      id: 1,
      title: '最初の投稿',
      content: 'これは初めての投稿です。'
    },
    {
      id: 2,
      title: '二つ目の投稿',
      content: 'これは二つ目の投稿です'
    }
    ]
  });

  it('Serviceが定義されていること', () => {
    expect(service).toBeDefined();
  });

  it('findAll()が記事の一覧を返すこと', () => {
    expect(service.findAll()).toEqual(expectedResponce);
  });

  it('findOne()が指定したIDの記事を返すこと', () => {
    expect(service.findOne(1)).toEqual(expectedResponce[0]);
    expect(service.findOne(2)).toEqual(expectedResponce[1]);
  });
});
